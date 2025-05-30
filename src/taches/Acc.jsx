import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styl.css';

export default function GestionTaches() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [er, setEr] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (description.trim() === '' || !dateDebut || !dateFin) {
      setEr("Tous les champs sont obligatoires.");
      return;
    }

    if (dateDebut > dateFin) {
      setEr("La date de début doit être inférieure à la date de fin.");
      return;
    }

    const newTask = {
      id: Date.now(),
      description,
      dateDebut,
      dateFin,
      etat: 'En cours',
    };

    setTasks([...tasks, newTask]);
    setDescription('');
    setDateDebut('');
    setDateFin('');
    setEr('');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleChangeEtat = (id, newEtat) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, etat: newEtat } : task
    ));
  };

  const reset = (event) => {
    event.preventDefault();
    setDescription('');
    setDateDebut('');
    setDateFin('');
    setEr('');
  };

  return (
    <fieldset className="p-4">
      <h1 className="mb-4">Gestion Des Tâches</h1>

      <div className="mb-3">
        <label>Description</label>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      <div className="mb-3">
        <label>Date Début</label>
        <input
          type="date"
          className="form-control"
          value={dateDebut}
          onChange={e => setDateDebut(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Date Fin</label>
        <input
          type="date"
          className="form-control"
          value={dateFin}
          onChange={e => setDateFin(e.target.value)}
        />
      </div>

      {er && <div className="alert alert-danger">{er}</div>}

      <button className="btn btn-primary mb-2 me-2" onClick={handleAddTask}>
        Ajouter une tâche
      </button>
      <button className="btn btn-secondary mb-4" onClick={reset}>
        Réinitialisation
      </button>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="table-active">
              <th>Numéro</th>
              <th>Description</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>État</th>
              <th>Actions</th>
              <th>Suppression</th>
              <th>Modification</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  Aucune tâche pour le moment.
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr key={task.id}>
                  <td data-label="Numéro">{idx + 1}</td>
                  <td data-label="Description">{task.description}</td>
                  <td data-label="Date Début">{task.dateDebut}</td>
                  <td data-label="Date Fin">{task.dateFin}</td>
                  <td data-label="État">{task.etat}</td>
                  <td data-label="Actions">
                    <button
                      className="btn btn-success btn-sm me-2 mb-1"
                      onClick={() => handleChangeEtat(task.id, 'Fait')}
                      disabled={task.etat === 'Fait'}
                    >
                      Fait
                    </button>
                    <button
                      className="btn btn-secondary btn-sm mb-1"
                      onClick={() => handleChangeEtat(task.id, 'Non fait')}
                      disabled={task.etat === 'Non fait'}
                    >
                      Non fait
                    </button>
                  </td>
                  <td data-label="Suppression">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                  <td data-label="Modification">
                    <button className="btn btn-warning btn-sm" disabled>
                      Modifier (à faire)
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}
