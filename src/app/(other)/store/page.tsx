import AboutMe from "@/components/Store/AboutMe";
import Products from "@/components/Store/Products";
import WhatToDo from "@/components/Store/WhatToDo";

export default function Store() {
  return (
    <>
      <div className="overflow-hidden">
        <Products />
        <AboutMe />
        <WhatToDo/>
      </div>
    </>
  );
}
