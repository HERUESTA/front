import React from "react";

type ButtonProps = {
  onClick: () => void;
};

const SearchButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-secondary" onClick={onClick}>
      検索
    </button>
  );
};

export default SearchButton;
