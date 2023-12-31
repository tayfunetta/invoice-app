import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "./useWindowSize";

const ulVariants = {
  open: {
    opacity: 1,
    scale: 1,
    borderRadius: "0%",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 0,
    scale: 0,
    borderRadius: "50%",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

interface TopProps {
  invNum: number;
  handleCreate: (val: boolean) => void;
  filter: string;
  handleFilter: (val: "paid" | "pending" | "total" | "draft") => void;
}

function Top({ invNum, handleCreate, filter, handleFilter }: TopProps) {
  const { windowSize } = useWindowSize();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const toggleControl = document.getElementById("toggle-control");

      if (target !== toggleControl && !target.classList.contains("ul-btn")) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <section className="flex justify-between mx-auto text-black dark:text-white">
      <div>
        <h1 className="sm:text-4xl text-2xl font-bold leading-5 tracking-tighter">
          Invoices
        </h1>
        <span className="text-sm text-gray-500 dark:text-lightGray">
          {windowSize.width > 640 ? (
            <>There are {invNum ? `${invNum} ${filter}` : "no"} invoices</>
          ) : (
            <>{invNum ? invNum : "No"} invoices</>
          )}
        </span>
      </div>

      <div className="relative flex items-center gap-x-4">
        <div className="flex items-center px-2 font-bold rounded-2xl">
          <button
            data-cy="filter-btn"
            id="toggle-control"
            className="flex items-center gap-x-2 z-20"
            onClick={() => setOpen(!open)}
          >
            {windowSize.width > 640 ? "Filter by status" : "Filter"}
            <img src="icon-arrow-down.svg" />
          </button>
          <motion.ul
            data-cy="filter-ul"
            className="absolute sm:top-12 top-10 origin-top sm:right-36 right-20 w-24 p-1 text-md font-normal bg-white shadow-md z-50"
            variants={ulVariants}
            animate={open ? "open" : "closed"}
          >
            <li>
              <button
                className="ul-btn w-full mb-1 px-1 text-start rounded-md bg-sky-100 hover:bg-sky-200 text-sky-700"
                onClick={() => {
                  handleFilter("total");
                  setOpen(false);
                }}
              >
                All
              </button>
            </li>
            <li>
              <button
                className="ul-btn w-full px-1 text-start rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700"
                onClick={() => {
                  handleFilter("pending");
                  setOpen(false);
                }}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                className="ul-btn w-full px-1 my-1 text-start rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                onClick={() => {
                  handleFilter("paid");
                  setOpen(false);
                }}
              >
                Paid
              </button>
            </li>
            <li>
              <button
                className="ul-btn w-full px-1 text-start rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  handleFilter("draft");
                  setOpen(false);
                }}
              >
                Draft
              </button>
            </li>
          </motion.ul>
        </div>

        <button
          data-cy="new-invoice"
          className="button-1"
          onClick={() => handleCreate(true)}
        >
          <img
            src="icon-plus.svg"
            className="p-[9px] m-0 bg-white rounded-full"
          />{" "}
          <span className="mt-px">
            {windowSize.width > 640 ? "New Invoice" : "New"}
          </span>
        </button>
      </div>
    </section>
  );
}

export default Top;
