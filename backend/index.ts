import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

async function databaseConnection() {
  try {
    await client.connect();
    console.log("Database is running and the connection is established.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
databaseConnection();

const app = express(),
  port = process.env.PORT || 3000;

app.use(express.json(), cors());

app.get("/data", async (_request, response) => {
  try {
    const sql = `
     SELECT spaceship.spaceshipId, spaceship.spaceshipName, docking_status.dockingStatusName
     FROM spaceship
     INNER JOIN docking_status ON spaceship.spaceshipDockingStatusId = docking_status.dockingStatusId
     ORDER BY spaceship.spaceshipId DESC;
    `;
    const { rows } = await client.query(sql);
    response.send(rows);
  } catch (error) {
    console.error("Error executing the SQL query:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/data/docking-status", async (_request, response) => {
  try {
    const sql = `SELECT * FROM docking_status;`;
    const { rows } = await client.query(sql);
    response.send(rows);
  } catch (error) {
    console.error("Error executing the SQL query:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.post("/data/post", async (_request, response) => {
  try {
    const { spaceshipName, dockingStatusId } = _request.body;

    // Database transaction
    await client.query("BEGIN");

    if (spaceshipName) {
      const insertSpaceshipQuery = `INSERT INTO spaceship (spaceshipName, spaceshipDockingStatusId) VALUES ($1, $2)`;
      const spaceshipValues = [spaceshipName, dockingStatusId];

      await client.query(insertSpaceshipQuery, spaceshipValues);
    }

    await client.query("COMMIT");

    response.send("Data successfully inserted into the database");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error executing the SQL query:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.put("/data/edit/:spaceshipId", async (_request, response) => {
  const { spaceshipId } = _request.params;
  const { dockingStatusId } = _request.body;

  try {
    const result = await client.query(
      "UPDATE spaceship SET spaceshipDockingStatusId = $1 WHERE spaceshipId = $2",
      [dockingStatusId, spaceshipId]
    );

    if (result.rowCount) {
      response.status(204).send(); // 204 No Content: Successful update
    } else {
      response.status(404).send("Spaceship not found");
    }
  } catch (error) {
    console.error("Error updating spaceship docking status:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/data/depart/:spaceshipId", async (_request, response) => {
  console.log("DELETE Received JSON data from frontend:", _request.params);
  const { spaceshipId } = _request.params;

  try {
    const result = await client.query(
      "DELETE FROM spaceship WHERE spaceshipId = $1",
      [spaceshipId]
    );

    if (result.rowCount) {
      response.status(204).send(); // 204 No Content: Successful deletion
    } else {
      response.status(404).send("Spaceship not found");
    }
  } catch (error) {
    console.error("Error departing spaceship:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Ready at http://localhost:${port}/`);
});
