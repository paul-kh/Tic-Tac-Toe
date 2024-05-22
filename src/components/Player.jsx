import { useState, useSyncExternalStore } from "react";

export default function Player({ initialName, symbol }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    // React auto put the previous state value a argument of the SetIsEditing() function.
    setIsEditing((editing) => !editing); //React strongly recommended to avoid using setIsEditing(!isEditing)
  }

  // COMMON PRACTICE: 2-way binding when user inputting value in the <input>
  function handleChange(event) {
    setPlayerName(event.target.value);
  }

  let editablePlayerName = <span className="player-name">{playerName}</span>;

  if (isEditing)
    editablePlayerName = (
      <input type="text" value={playerName} onChange={handleChange} required />
    );

  return (
    <>
      <li>
        <span className="player">
          {editablePlayerName}
          <span className="player-symbol">{symbol}</span>
        </span>
        <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
      </li>
    </>
  );
}
