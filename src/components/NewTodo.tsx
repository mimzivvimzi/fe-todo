import { BaseSyntheticEvent, useState } from "react";
import { OverlayTrigger, Toast, Tooltip } from "react-bootstrap";

type NewTodoProps = {
  totalTodos: number;
  onClick?: () => void;
};

const NewTodo = (props: NewTodoProps) => {
  const { totalTodos } = props;
  const maxTodos = totalTodos === 10;
  const [todoInput, setTodoInput] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const postItems = async () => {
    const url: string = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_TEST_USERNAME}/todos/create`;
    try {
      const response = await fetch(url, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: todoInput,
        }),
      });
      return await response.json();
    } catch (e) {
      console.error(e);
    }
  };

  const submitHandler = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    if (todoInput.trim() !== "") {
      setTodoInput("");
      postItems().catch((e) => console.error(e));
      props.onClick?.();
    } else {
      setShowWarning(true);
    }
  };

  return (
    <>
      <form className="todo-form" onSubmit={submitHandler}>
        <input
          className="todo-input"
          type="text"
          id="new-todo"
          name="new-todo"
          placeholder="Add your to-do..."
          onChange={(e) => setTodoInput(e.target.value)}
          value={todoInput}
        />
        {maxTodos ? (
          <OverlayTrigger
            placement={"right"}
            overlay={<Tooltip>Max 10 to-dos</Tooltip>}
          >
            <button
              style={{ opacity: "50%" }}
              className="add-button"
              type="submit"
              disabled={true}
            >
              Add
            </button>
          </OverlayTrigger>
        ) : (
          <button
            style={{ position: "relative" }}
            className="add-button"
            type="submit"
          >
            Add
          </button>
        )}
      </form>
      <Toast
        style={{ position: "absolute", zIndex: 10 }}
        bg="warning"
        show={showWarning}
        onClose={() => setShowWarning(false)}
        delay={3000}
        autohide
      >
        <Toast.Body>Text must not be empty</Toast.Body>
      </Toast>
    </>
  );
};

export { NewTodo };
