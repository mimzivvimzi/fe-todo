import { NewTodo } from "@/components/NewTodo";
import { TodoItem } from "@/components/TodoItem";
import { TodoDto } from "@/interface/Todo";
import useSWR from "swr";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const completedCount = data && data.filter((todo) => todo.isDone).length;

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
      <div className="progress-section">
        <h2 style={{ fontSize: 28 }}>Progress</h2>
        {data && (
          <div>
            <ProgressBar
              max={data.length}
              now={completedCount}
              variant="info"
            />
            <div className="completed-text">{completedCount} completed</div>
          </div>
        )}
      </div>
      <div className="header-row">
        <div className="todo-title">To-dos</div>
        <div
          style={{
            position: "relative",
            cursor: "pointer",
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
                <Menu.Item key={option.value} as="div">
                  {({ active }) => (
                    <div
                      className={`filter-button-option ${
                        active ? "filter-active" : "filter-inactive"
                      }`}
                      onClick={() => setFilter(option)}
                    >
                      {option.label}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </div>
      {data && data.length > 0 && (
        <>
          <NewTodo
            totalTodos={data.length}
            onClick={() => mutate().catch((e) => console.error(e))}
          />
          {renderFilteredView(data, filter.value)}
        </>
      )}
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
