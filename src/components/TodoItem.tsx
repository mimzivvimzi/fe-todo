import { TodoDto } from "@/interface/Todo";
import { Menu } from "@headlessui/react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type TodoItemProps = {
  todo: TodoDto;
  onUpdate?: () => void;
};
const TodoItem = (props: TodoItemProps) => {
  const { todo } = props;
  const [isChecked, setIsChecked] = useState<boolean>(todo.isDone);

  const putItem = async () => {
    const url: string = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_TEST_USERNAME}/todos/${todo._id}/toggle`;
    try {
      const response = await fetch(url, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteItem = async () => {
    const url: string = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_TEST_USERNAME}/todos/${todo._id}`;
    try {
      const response = await fetch(url, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = () => {
    setIsChecked(!isChecked);
    putItem()
      .then(() => props.onUpdate?.())
      .catch((e) => console.error(e));
  };

  const handleDelete = () => {
    deleteItem()
      .then(() => props.onUpdate?.())
      .catch((e) => console.error(e));
  };

  return (
    <div className="todo-item">
      <div className="item-inner">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isChecked}
          onChange={handleClick}
        />
        <div
          style={
            isChecked
              ? { textDecorationLine: "line-through", color: "#a9a9a9" }
              : { color: "#2e2e2e" }
          }
        >
          {todo.text}
        </div>
      </div>
      <div
        style={{ position: "relative", cursor: "pointer", marginRight: "20px" }}
      >
        <Menu as="div">
          <div>
            <Menu.Button style={{ cursor: "pointer" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                opacity="0.4"
                className="bi bi-three-dots"
                viewBox="0 0 16 16"
              >
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </Menu.Button>
          </div>
          <Menu.Items>
            <div>
              <Menu.Item>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export { TodoItem };
