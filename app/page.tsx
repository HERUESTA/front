import Image from "next/image";
import TextInput from "./components/textInput/TextInput";

export default function Home() {
  return (
    <>
      <div>
        <TextInput placeholder="配信者ID" />
        <TextInput placeholder="検索" />

        <button className="btn btn-primary">検索</button>
      </div>
    </>
  );
}
