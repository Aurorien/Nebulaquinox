-- If not already done, run first: CREATE DATABASE Nebulaquinox

CREATE TABLE docking_status (
  dockingStatusId SERIAL PRIMARY KEY,
  dockingStatusName VARCHAR(100) NOT NULL
);

CREATE TABLE spaceship (
  spaceshipId SERIAL PRIMARY KEY,
  spaceshipName VARCHAR(250) NOT NULL,
  spaceshipDockingStatusId INT,
	FOREIGN KEY (spaceshipDockingStatusId) REFERENCES docking_status(dockingStatusId)
);

INSERT INTO docking_status (dockingStatusName)
VALUES
  ('Incomming'), ('Docking'), ('Docked'), ('Undocking');

INSERT INTO spaceship (spaceshipName, spaceshipDockingStatusId)
VALUES
  ('Quantumixis', 3),
  ('Starcore', 1),
  ('Nebulynth', 4),
  ('Darkvoida', 1),
  ('Cosmoglide', 2),
  ('Chronoflux', 3),
  ('Stellacron', 3),
  ('Holoquanta', 4),
  ('Voidmancer', 4),
  ('Quantumara', 2);

  ----------------------------------
  --Example queries

  SELECT spaceship.spaceshipId, spaceship.spaceshipName, docking_status.dockingStatusName
  FROM spaceship
  INNER JOIN docking_status ON spaceship.spaceshipDockingStatusId = docking_status.dockingStatusId
  ORDER BY spaceship.spaceshipId ASC;

  SELECT * FROM docking_status;

  INSERT INTO spaceship (spaceshipName, spaceshipDockingStatusId) VALUES ('Heliumbalux', 3);
