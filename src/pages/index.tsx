import Head from "next/head";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <>
      <Head>
        <title>To-do List</title>
      </Head>
      <div className="outer-container">
        <TodoList />
      </div>
    </>
  );
}
