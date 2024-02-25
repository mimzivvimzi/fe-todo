import { NewTodo } from "@/components/NewTodo";
import { TodoItem } from "@/components/TodoItem";
import { TodoDto } from "@/interface/Todo";
import useSWR from "swr";

const TodoList = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR<TodoDto[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_TEST_USERNAME}/todos`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (error) {
    console.error(error);
  }

  return (
    <div className="list-container">
      <div className="todo-title">To-dos</div>
      <NewTodo onClick={() => mutate().catch((e) => console.error(e))} />
      {data &&
        data.length > 0 &&
        data.map((item) => (
          <TodoItem
            key={item._id}
            todo={item}
            onUpdate={() => mutate().catch((e) => console.error(e))}
          />
        ))}
    </div>
  );
};

export { TodoList };
