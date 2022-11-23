import logo from './logo.svg';
import './App.css';
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import moment from 'moment';

const db = new Dexie('todoApp')
db.version(1).stores({
  todos: '++id,task,completed,created_at,updated_at'
})

const { todos } = db


function App() {
  const allItems = useLiveQuery(() => todos.toArray(), [])

  const addTask = async (event) => {
    event.preventDefault()
    const taskField = document.querySelector('#taskInput')

    await todos.add({
      task: taskField['value'],
      completed: false,
      created_at: moment().format("DD-MM-YYYY hh:mm:ss"),
      updated_at: moment().format("DD-MM-YYYY hh:mm:ss")
    })

    taskField['value'] = ''
  }

  const toggleStatus = async (id, event) => {
    await todos.update(id, { completed: !!event.target.checked, updated_at: moment().format("DD-MM-YYYY hh:mm:ss")})
  }

  const deleteTask = async (id) => todos.delete(id)

  console.log('====', allItems)
  return (
    <div className="container">
      <h3 className="teal-text center-align">Todo App</h3>
      <form className="add-item-form" onSubmit={addTask}>
        <input type="text" id="taskInput" placeholder="What do you want to do today?" required />
        <button type="submit" className="waves-effect btn teal right">
          Add
        </button>
      </form>

      <div className="card white darken-1">
        <div className="card-content">
        {!allItems?.length && <p className="center-align">You've not added any task yet.</p>}
          {allItems?.map(({id, task, completed}) => (
            <div className="row" key={id}>
              <p className="col s10">
                <label>
                <input
                    type="checkbox"
                    checked={completed}
                    className="checkbox-blue"
                    onChange={(event) => toggleStatus(id, event)}
                  />
                  <span className={`black-text ${completed && 'strike-text'}`}>{task}</span>
                </label>
              </p>
              <i onClick={() => deleteTask(id)} className="col s2 material-icons delete-button">delete</i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
