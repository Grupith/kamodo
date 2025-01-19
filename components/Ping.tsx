import React from "react";

function Ping() {
  return (
    <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
    </span>
  );
}

export default Ping;
