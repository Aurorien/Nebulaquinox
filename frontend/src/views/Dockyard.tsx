import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Dockyard.css";
import axios from "axios";
import Dropdown from "../components/Dropdown";

interface ApiResponse {
  spaceshipid: number;
  spaceshipname: string;
  dockingstatusname: string;
}

export interface FormData {
  spaceshipName: string;
  dockingStatusId: number | null;
}

function Dockyard() {
  const [editMode, setEditMode] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const formElement = document.getElementById("add-spaceship-form");
      if (
        formElement &&
        !formElement.contains(target) &&
        !target.classList.contains("button-plus")
      ) {
        handleFormMode(0);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [data, setData] = useState<ApiResponse[] | null>(null),
    [loading, setLoading] = useState<boolean>(true),
    [formData, setFormData] = useState<FormData>({
      spaceshipName: "",
      dockingStatusId: null,
    });

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const jsonData = JSON.stringify({
      spaceshipName: formData.spaceshipName,
      dockingStatusId: formData.dockingStatusId,
    });

    axios
      .post("/data/post", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Add spaceship - response.data", response.data);
        fetchDataAndReload();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFormData({
          spaceshipName: "",
          dockingStatusId: null,
        });
        handleFormMode(0);
      });
  }

  const isSubmitDisabled = !(
    formData.spaceshipName && formData.dockingStatusId
  );

  const setDataCallback = useCallback((data: ApiResponse[] | null) => {
    setData(data);
  }, []);

  useEffect(() => {
    axios
      .get("/data")
      .then((response) => {
        console.log("response GET", response);

        setDataCallback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [setDataCallback]);

  function fetchDataAndReload() {
    axios
      .get("/data")
      .then((response) => {
        setDataCallback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }

  const handleEditMode = (spaceshipId: number) => {
    setEditMode(spaceshipId);
  };

  const [formMode, setFormMode] = useState<number>(0);

  const handleFormMode = (value: number) => {
    setFormMode(value);
  };

  const handleSave = (spaceshipId: number, dockingStatusId: number | null) => {
    axios
      .put(`/data/edit/${spaceshipId}`, { dockingStatusId })
      .then(() => {
        console.log(`Spaceship ${spaceshipId} updated successfully`);
        fetchDataAndReload();
        setEditMode(null); // Exit edit mode
      })
      .catch((error) => {
        console.error(`Error updating spaceship ${spaceshipId}:`, error);
      })
      .finally(() => {
        setFormData({
          spaceshipName: "",
          dockingStatusId: null,
        });
      });
  };

  const handleDeparted = (spaceshipId: number) => {
    axios
      .delete(`/data/depart/${spaceshipId}`)
      .then(() => {
        console.log(`Spaceship ${spaceshipId} departed successfully`);
        fetchDataAndReload();
      })
      .catch((error) => {
        console.error(`Error departing spaceship ${spaceshipId}:`, error);
      });
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <h1>Spaceship dockyard</h1>
      {formMode ? (
        <div className="add-spaceship-wrapper" id="add-spaceship-form">
          <div className="add-spaceship-title-wrapper">
            <h2 className="add-spaceship">Add spaceship</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <div>
                <input
                  name="spaceshipName"
                  onChange={handleInput}
                  value={formData.spaceshipName}
                  id="add-name"
                />
              </div>
            </label>
            <label>
              Docking status:
              <div>
                <Dropdown formData={formData} handleSelect={handleSelect} />
              </div>
            </label>
            <button type="submit" disabled={isSubmitDisabled} id="add-button">
              Add
            </button>
          </form>
        </div>
      ) : (
        <div className="button-plus-wrapper">
          <button
            className="button-plus"
            id="plus-button"
            onClick={() => handleFormMode(1)}
          >
            +
          </button>
        </div>
      )}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data && (
            <div className="spaceship-list-wrapper">
              <div className="spaceship-list">
                <h2>Docked spaceships:</h2>
                <ol className="spaceship-ol">
                  {data.map((data) => (
                    <li
                      key={data.spaceshipid}
                      className={`spaceship-li-name ${
                        editMode === data.spaceshipid ? "edit-mode" : ""
                      }`}
                    >
                      <span id="spaceship-name">
                        <div className="spaceship-li-label">
                          Spaceship name:
                        </div>{" "}
                        {data.spaceshipname}{" "}
                      </span>
                      <span>
                        {editMode === data.spaceshipid ? (
                          <div>
                            <label>
                              Docking status:
                              <Dropdown
                                formData={formData}
                                handleSelect={handleSelect}
                              />
                            </label>
                            <span>
                              <button
                                onClick={() => handleDeparted(data.spaceshipid)}
                                className="button-departed"
                              >
                                Departed
                              </button>
                            </span>
                            <button
                              type="button"
                              disabled={formData.dockingStatusId ? false : true}
                              onClick={() =>
                                handleSave(
                                  data.spaceshipid,
                                  formData.dockingStatusId
                                )
                              }
                              className="button-save"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>
                              <div className="spaceship-li-label">
                                Docking status:
                              </div>{" "}
                              {data.dockingstatusname}
                            </span>
                            <span className="button-edit">
                              <button
                                onClick={() => handleEditMode(data.spaceshipid)}
                              >
                                Edit
                              </button>
                            </span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Dockyard;
