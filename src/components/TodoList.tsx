import { NewTodo } from "@/components/NewTodo";

const TodoList = () => {
  return (
    <div className="list-container">
      <div className="todo-title">To-dos</div>
      <NewTodo />
    </div>
  );
};

export { TodoList };
