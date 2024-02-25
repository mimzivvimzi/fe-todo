import { NewTodo } from "@/components/NewTodo";
import { TodoItem } from "@/components/TodoItem";
import { TodoDto } from "@/interface/Todo";
import useSWR from "swr";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";

const TodoList = () => {
  const [filter, setFilter] = useState<{ label: string; value: Filter }>({
    label: "All",
    value: Filter.ALL,
  });
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR<TodoDto[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_TEST_USERNAME}/todos`,
    fetcher,
    { refreshInterval: 3000 }
  );

  if (error) {
    console.error(error);
  }

  const renderFilteredView = (data: TodoDto[], filter: Filter) => {
    let filteredData;
    if (data) {
      switch (filter) {
        case Filter.CHECKED:
          filteredData = data.filter((todo) => todo.isDone);
          break;
        case Filter.UNCHECKED:
          filteredData = data.filter((todo) => !todo.isDone);
          break;
        case Filter.ALL:
          filteredData = data;
          break;
        default:
          filteredData = data;
          break;
      }
    }
    return (
      filteredData &&
      filteredData.map((item) => (
        <TodoItem
          key={item._id}
          todo={item}
          onUpdate={() => mutate().catch((e) => console.error(e))}
        />
      ))
    );
  };

  return (
    <div className="list-container">
      <div className="header-row">
        <div className="todo-title">To-dos</div>
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            marginRight: "20px",
          }}
        >
          <Menu as="div">
            <div>
              <Menu.Button>
                <div className="filter-button">
                  {filter.label}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </div>
              </Menu.Button>
            </div>
            <Menu.Items className="filter-button-options">
              {filterOptions.map((option) => (
                <Menu.Item
                  className="filter-button=option"
                  as="div"
                  key={option.label}
                  onClick={() => setFilter(option)}
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <NewTodo onClick={() => mutate().catch((e) => console.error(e))} />
      {data && data.length > 0 && renderFilteredView(data, filter.value)}
    </div>
  );
};

enum Filter {
  ALL = "ALL",
  CHECKED = "CHECKED",
  UNCHECKED = "UNCHECKED",
}

const filterOptions: { label: string; value: Filter }[] = [
  { label: "All", value: Filter.ALL },
  { label: "Done", value: Filter.CHECKED },
  { label: "Undone", value: Filter.UNCHECKED },
];

export { TodoList };
