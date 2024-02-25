import { BaseSyntheticEvent, useState } from "react";

type NewTodoProps = {
  onClick?: () => void;
};

const NewTodo = (props: NewTodoProps) => {
  const [todoInput, setTodoInput] = useState<string>("");
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
    setTodoInput("");
    event.preventDefault();
    postItems().catch((e) => console.error(e));
    props.onClick?.();
  };

  return (
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
      <button className="add-button" type="submit">
        Add
      </button>
    </form>
  );
};

export { NewTodo };
