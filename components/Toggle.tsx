import { useState, useEffect } from "react";

interface ToggleProps {
  paymentTerms: number;
  handlePaymentTerms: (value: number) => void;
  style?: string;
  removeStyle?: () => void;
}

function Toggle({
  paymentTerms,
  handlePaymentTerms,
  style,
  removeStyle,
}: ToggleProps) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#input-wrapper")) {
        setShow(false);
      }
      if ((e.target as HTMLElement).id === "payment-terms-label") {
        setShow(true);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleChosen = (value: number) => {
    handlePaymentTerms(value);
    if (removeStyle) removeStyle();
    setShow(false);
  };

  return (
    <div id="input-wrapper" className="relative md:basis-1/2">
      <div className="flex justify-between items-end mt-5">
        <label id="payment-terms-label" className="input-label">
          Payment Terms
        </label>
        {style === "border-red" && (
          <span className="text-end text-red text-xs">can't be empty</span>
        )}
      </div>
      <button
        data-cy="payment-terms-btn"
        className={`flex justify-between items-center w-full h-10 dark:text-white dark:bg-dark font-bold px-3 rounded-md border ${style} ${
          show && "border-customPurple"
        } hover:border-customPurple`}
        onClick={() => setShow(!show)}
      >
        <span>Net {paymentTerms} Day(s)</span>
        <img src="/icon-arrow-down.svg" />
      </button>

      {show && (
        <div className="absolute md:top-[90px] top-[70px] w-full divide-y-2 dark:divide-black bg-lightBG dark:text-lightGray dark:bg-darkBlue dark:shadow-none custom-shadow-2 rounded-md">
          <button
            className="block w-full pl-5 py-[10px] text-start font-bold hover:text-customPurple"
            onClick={() => handleChosen(1)}
          >
            Net 1 day
          </button>
          <button
            className="block w-full pl-5 py-[10px] text-start font-bold hover:text-customPurple"
            onClick={() => handleChosen(7)}
          >
            Net 7 days
          </button>
          <button
            className="block w-full pl-5 py-[10px] text-start font-bold hover:text-customPurple"
            onClick={() => handleChosen(14)}
          >
            Net 14 days
          </button>
          <button
            className="block w-full pl-5 py-[10px] text-start font-bold hover:text-customPurple"
            onClick={() => handleChosen(30)}
          >
            Net 30 days
          </button>
        </div>
      )}
    </div>
  );
}

export default Toggle;
