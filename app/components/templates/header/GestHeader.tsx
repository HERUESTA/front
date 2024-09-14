import Link from "next/link";
import React from "react";

const GestHeader = () => {
  return (
    <div className="flex">
      <Link href="/service">
        <p className="mr-4">利用規約</p>
      </Link>
      <Link href="/use">
        <p>使い方</p>
      </Link>
      <Link href="/profile">
      <p>マイプロフィール</p>
      </Link>
    </div>
  );
};

export default GestHeader;
