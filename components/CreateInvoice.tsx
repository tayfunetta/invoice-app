import Link from "next/link";
import Image from "next/image";
import Header from "./Header";
import { useState, useEffect, useRef } from "react";
import Toggle from "./Toggle";
import { ItemArrayProps } from "./Edit";
import { MdDelete } from "react-icons/md";
import { useSessionStorage } from "./useSessionStorage";
import { useWindowSize } from "./useWindowSize";
import { InvoiceProps } from "../pages";

interface CreateInvoiceProps {
  handleCreate: (val: boolean) => void;
}

function CreateInvoice({ handleCreate }: CreateInvoiceProps) {
  const [items, setItems] = useState<ItemArrayProps[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<number>(0);
  const [inputs, setInputs] = useState<HTMLCollectionOf<HTMLInputElement>>(
    document.getElementsByTagName("input")
  );
  const [toggleStyle, setToggleStyle] = useState<
    "border-red" | "border-lightGray dark:border-darkBlue"
  >("border-lightGray dark:border-darkBlue");
  const { addNewItemToSS } = useSessionStorage();
  const { windowSize } = useWindowSize();
  const allFieldAlert = useRef<HTMLParagraphElement>();
  const itemAlert = useRef<HTMLParagraphElement>();

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id === "background-cover") {
        handleCreate(false);
      }
    });
  }, []);

  useEffect(() => {
    refreshBorder();
    setInputs(document.getElementsByTagName("input"));
  }, [items]);

  const hideSpan = (elem: HTMLInputElement) => {
    elem.previousElementSibling.classList.remove("block");
    elem.previousElementSibling.classList.add("hidden");
    elem.classList.remove("border-red");

    allFieldAlert.current.classList.remove("visible");
    allFieldAlert.current.classList.add("invisible");
  };

  const handlePaymentTerms = (value: number) => {
    setPaymentTerms(value);
  };

  const handleQtyChange = (value: string, index: number) => {
    const list = [...items];
    list[index].quantity = Number(value);
    list[index].total = Number(value) * list[index].price;
    setItems(list);
  };

  const handlePriceChange = (value: string, index: number) => {
    const list = [...items];
    list[index].price = Number(value);
    list[index].total = Number(value) * list[index].quantity;
    setItems(list);
  };

  const addNewItem = () => {
    setItems([...items, { name: "New Item", quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const list = [...items];
    list.splice(index, 1);
    setItems(list);
  };

  const removeStyle = () => {
    setToggleStyle("border-lightGray dark:border-darkBlue");
  };

  const refreshBorder = () => {
    for (let input of inputs) {
      input.classList.remove("border-red");
      input.classList.add("border-lightGray");
      input.classList.add("dark:border-darkBlue");
    }
  };

  const createID = (): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let str = "";
    str += letters[Math.floor(Math.random() * 26)];
    str += letters[Math.floor(Math.random() * 26)];
    str += Math.floor(Math.random() * 10);
    str += Math.floor(Math.random() * 10);
    str += Math.floor(Math.random() * 10);
    str += Math.floor(Math.random() * 10);
    return str;
  };

  const handleDraftOrSave = (status: "draft" | "pending") => {
    const createdAtInput = document.getElementById("date") as HTMLInputElement;
    const createdAt = createdAtInput.value;

    const paymentDue = (): string => {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + paymentTerms);
      return date.toString();
    };

    const descriptionInput = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const description = descriptionInput.value;

    const clientNameInput = document.getElementById(
      "client-name"
    ) as HTMLInputElement;
    const clientName = clientNameInput.value;

    const clientEmailInput = document.getElementById(
      "client-email"
    ) as HTMLInputElement;
    const clientEmail = clientEmailInput.value;

    const senderStreetInput = document.getElementById(
      "street"
    ) as HTMLInputElement;
    const senderStreet = senderStreetInput.value;

    const senderCityInput = document.getElementById("city") as HTMLInputElement;
    const senderCity = senderCityInput.value;

    const senderPostCodeInput = document.getElementById(
      "post-code"
    ) as HTMLInputElement;
    const senderPostCode = senderPostCodeInput.value;

    const senderCountryInput = document.getElementById(
      "country"
    ) as HTMLInputElement;
    const senderCountry = senderCountryInput.value;

    const toStreetInput = document.getElementById(
      "tostreet"
    ) as HTMLInputElement;
    const toStreet = toStreetInput.value;

    const toCityInput = document.getElementById("tocity") as HTMLInputElement;
    const toCity = toCityInput.value;

    const toPostcodeInput = document.getElementById(
      "topost-code"
    ) as HTMLInputElement;
    const toPostcode = toPostcodeInput.value;

    const toCountryInput = document.getElementById(
      "tocountry"
    ) as HTMLInputElement;
    const toCountry = toCountryInput.value;

    const total: number = items.reduce((sum, item) => sum + item.total, 0);

    const invoice: InvoiceProps = {
      id: createID(),
      createdAt,
      paymentDue: paymentDue(),
      description,
      paymentTerms,
      clientName,
      clientEmail,
      status,
      senderAddress: {
        street: senderStreet,
        city: senderCity,
        postCode: senderPostCode,
        country: senderCountry,
      },
      clientAddress: {
        street: toStreet,
        city: toCity,
        postCode: toPostcode,
        country: toCountry,
      },
      items,
      total,
    };
    addNewItemToSS(invoice);
    handleCreate(false);
  };

  const handleFocus = (elem: HTMLInputElement) => {
    elem.classList.remove("border-lightGray");
    elem.classList.remove("dark:border-darkBlue");
  };

  const showSpan = (elem: HTMLInputElement) => {
    elem.previousElementSibling.classList.remove("hidden");
    elem.previousElementSibling.classList.add("block");

    allFieldAlert.current.classList.remove("invisible");
    allFieldAlert.current.classList.add("visible");
  };

  const checkIfEveryInputIsValid = () => {
    let save: boolean = true;
    outerLoop: for (let input of inputs) {
      switch (input.type) {
        case "text":
          const val = input.value.trim();
          if (val.length === 0) {
            input.classList.remove("border-lightGray");
            input.classList.remove("dark:border-darkBlue");
            input.classList.add("border-red");
            showSpan(input);
            save = false;
            break outerLoop;
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            input.classList.remove("border-lightGray");
            input.classList.remove("dark:border-darkBlue");
            input.classList.add("border-red");
            showSpan(input);
            save = false;
            break outerLoop;
          }
          break;
        case "number":
          if (Number(input.value) <= 0) {
            input.classList.remove("border-lightGray");
            input.classList.remove("dark:border-darkBlue");
            input.classList.add("border-red");
            save = false;
            break outerLoop;
          }
          break;
        case "date":
          if (input.value.length === 0) {
            input.classList.remove("border-lightGray");
            input.classList.remove("dark:border-darkBlue");
            input.classList.add("border-red");
            showSpan(input);
            save = false;
            break outerLoop;
          }
          break;
        default:
          break;
      }
      if (!paymentTerms) {
        setToggleStyle("border-red");
        save = false;
      }
    }
    if (save && items.length) {
      handleDraftOrSave("pending");
    }
  };

  return windowSize.width > 768 ? (
    <div
      data-cy="creating-modal-wrapper"
      id="background-cover"
      className="fixed bg-black bg-opacity-40 w-full h-screen z-50"
    >
      <div
        data-cy="creating-modal"
        className="w-[40rem] bg-white dark:bg-black2 h-screen overflow-scroll"
      >
        <button
          className="flex justify-start items-baseline gap-x-4 dark:text-white font-bold mt-10 px-6"
          onClick={() => handleCreate(false)}
        >
          <Image
            src="/icon-arrow-left.svg"
            alt="left arrow"
            width={7}
            height={7}
          />
          Go back
        </button>
        <form
          id="form1"
          className="mt-5 mx-5 pb-32"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="font-bold text-2xl dark:text-white tracking-tight">
            New Invoice
          </h2>

          <fieldset className="mt-5">
            <legend className="font-bold text-customPurple">Bill From</legend>

            <div className="flex flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="street">
                Street Address
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="street"
                type="text"
                maxLength={30}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>

            <div className="flex gap-x-4">
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="city">
                  City
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="city"
                  type="text"
                  maxLength={20}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="post-code">
                  Post Code
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="post-code"
                  type="text"
                  maxLength={10}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="country">
                  Country
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="country"
                  type="text"
                  maxLength={20}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="font-bold text-customPurple">Bill To</legend>

            <div className="flex flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="client-name">
                Client's Name
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="client-name"
                type="text"
                maxLength={20}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="client-email">
                Client's Email
              </label>
              <span className="hidden text-red text-xs">
                can't be empty or invalid
              </span>
              <input
                data-cy="email-input"
                id="client-email"
                type="email"
                maxLength={35}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="tostreet">
                Street Address
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="tostreet"
                type="text"
                maxLength={25}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>

            <div className="flex gap-x-4">
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="tocity">
                  City
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="tocity"
                  type="text"
                  maxLength={20}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="topost-code">
                  Post Code
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="topost-code"
                  type="text"
                  maxLength={10}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
              <div className="flex basis-1/3 flex-wrap items-center justify-between mt-5">
                <label className="input-label" htmlFor="tocountry">
                  Country
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id="tocountry"
                  type="text"
                  maxLength={20}
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
            </div>

            <div className="flex gap-x-4 items-end">
              <div className="flex grow flex-wrap items-center justify-between mt-10">
                <label className="input-label" htmlFor="date">
                  Invoice Date
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  type="date"
                  id="date"
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>
              <Toggle
                paymentTerms={paymentTerms}
                handlePaymentTerms={handlePaymentTerms}
                style={toggleStyle}
                removeStyle={removeStyle}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="description">
                Project Description
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="description"
                type="text"
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="font-bold text-customPurple">Item List</legend>

            <div className="grid grid-cols-9 gap-x-2 mt-5">
              <label className="col-span-3 input-label">Item Name</label>
              <label className="input-label">Qty.</label>
              <label className="col-span-2 input-label">Price</label>
              <span className="input-label">Total</span>
            </div>

            {items.map((item, index) => (
              <div key={item.name}>
                <div className="grid grid-cols-9 gap-x-2 mt-3">
                  <div className="col-span-3">
                    <span className="hidden text-red text-xs">
                      can't be empty
                    </span>
                    <input
                      id={`item-${index + 1}`}
                      type="text"
                      defaultValue={item.name}
                      className="custom-input border-lightGray dark:border-darkBlue"
                      onChange={(e) => hideSpan(e.target)}
                      onFocus={(e) => handleFocus(e.target)}
                      onBlur={() => refreshBorder()}
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      id={`quantity-${index + 1}`}
                      defaultValue={item.quantity}
                      className="custom-input border-lightGray dark:border-darkBlue"
                      onChange={(e) => handleQtyChange(e.target.value, index)}
                      onFocus={(e) => handleFocus(e.target)}
                      onBlur={() => refreshBorder()}
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      id={`price-${index + 1}`}
                      defaultValue={item.price}
                      className="custom-input border-lightGray dark:border-darkBlue"
                      onChange={(e) => handlePriceChange(e.target.value, index)}
                      onFocus={(e) => handleFocus(e.target)}
                      onBlur={() => refreshBorder()}
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center h-10 text-darkerGray dark:text-lightGray font-bold text-[15px]">
                      {item.total.toFixed(2)}
                    </div>
                  </div>

                  <button
                    className="remove-item-btn grid place-items-center self-center h-10"
                    onClick={() => removeItem(index)}
                  >
                    <MdDelete className="remove-icon w-6 h-6 text-darkerGray" />
                  </button>
                </div>
              </div>
            ))}

            <button className="button-6" onClick={() => addNewItem()}>
              <img src="/icon-plus.svg" />
              Add New Item
            </button>

            <p
              ref={allFieldAlert}
              className="invisible mt-7 text-red text-sm font-semibold"
            >
              -All fields must be added
            </p>
            {!items.length && (
              <p ref={itemAlert} className="text-red text-sm font-semibold">
                -An item must be added
              </p>
            )}
          </fieldset>
        </form>

        <div className="fixed bottom-0 flex justify-between items-center gap-x-2 w-[40rem] h-20 px-5 custom-shadow dark:shadow-none bg-white dark:bg-dark">
          <button className="button-3" onClick={() => handleCreate(false)}>
            Discard
          </button>

          <div className="flex gap-x-2">
            <button
              className="button-4"
              onClick={() => handleDraftOrSave("draft")}
            >
              Save as Draft
            </button>
            <button
              className="button-2"
              onClick={() => checkIfEveryInputIsValid()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="dark:bg-black2">
      <Header />

      <Link
        href="/"
        className="flex justify-start items-baseline gap-x-4 dark:text-white font-bold mt-10 px-6"
        onClick={() => handleCreate(false)}
      >
        <Image
          src="/icon-arrow-left.svg"
          alt="left arrow"
          width={7}
          height={7}
        />
        Go back
      </Link>

      <form
        id="form1"
        className="mt-5 mx-5 pb-32"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="font-bold text-2xl dark:text-white tracking-tight">
          New Invoice
        </h2>

        <fieldset className="mt-5">
          <legend className="font-bold text-customPurple">Bill From</legend>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="street">
              Street Address
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="street"
              type="text"
              maxLength={30}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <div className="flex gap-x-4">
            <div className="flex basis-1/2 flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="city">
                City
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="city"
                type="text"
                maxLength={20}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>
            <div className="flex basis-1/2 flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="post-code">
                Post Code
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="post-code"
                type="text"
                maxLength={10}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="country">
              Country
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="country"
              type="text"
              maxLength={20}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="font-bold text-customPurple">Bill To</legend>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="client-name">
              Client's Name
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="client-name"
              type="text"
              maxLength={20}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="client-email">
              Client's Email
            </label>
            <span className="hidden text-red text-xs">
              can't be empty or invalid
            </span>
            <input
              id="client-email"
              type="email"
              maxLength={35}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="tostreet">
              Street Address
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="tostreet"
              type="text"
              maxLength={25}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <div className="flex gap-x-4">
            <div className="flex basis-1/2 flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="tocity">
                City
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="tocity"
                type="text"
                maxLength={20}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>
            <div className="flex basis-1/2 flex-wrap items-center justify-between mt-5">
              <label className="input-label" htmlFor="topost-code">
                Post Code
              </label>
              <span className="hidden text-red text-xs">can't be empty</span>
              <input
                id="topost-code"
                type="text"
                maxLength={10}
                className="custom-input border-lightGray dark:border-darkBlue"
                onChange={(e) => hideSpan(e.target)}
                onFocus={(e) => handleFocus(e.target)}
                onBlur={() => refreshBorder()}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="tocountry">
              Country
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="tocountry"
              type="text"
              maxLength={20}
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between mt-10">
            <label className="input-label" htmlFor="date">
              Invoice Date
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              type="date"
              id="date"
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>

          <Toggle
            paymentTerms={paymentTerms}
            handlePaymentTerms={handlePaymentTerms}
            style={toggleStyle}
            removeStyle={removeStyle}
          />

          <div className="flex flex-wrap items-center justify-between mt-5">
            <label className="input-label" htmlFor="description">
              Project Description
            </label>
            <span className="hidden text-red text-xs">can't be empty</span>
            <input
              id="description"
              type="text"
              className="custom-input border-lightGray dark:border-darkBlue"
              onChange={(e) => hideSpan(e.target)}
              onFocus={(e) => handleFocus(e.target)}
              onBlur={() => refreshBorder()}
            />
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="font-bold text-customPurple">Item List</legend>

          {items.map((item, index) => (
            <div key={item.name} className="mb-12">
              <div className="flex flex-wrap items-center justify-between mt-5">
                <label
                  key={index}
                  className="block mb-2 text-fadedPurple text-sm"
                  htmlFor={`item-${index + 1}`}
                >
                  Item Name
                </label>
                <span className="hidden text-red text-xs">can't be empty</span>
                <input
                  id={`item-${index + 1}`}
                  type="text"
                  className="custom-input border-lightGray dark:border-darkBlue"
                  onChange={(e) => hideSpan(e.target)}
                  onFocus={(e) => handleFocus(e.target)}
                  onBlur={() => refreshBorder()}
                />
              </div>

              <div className="grid grid-cols-6 gap-x-2 mt-5">
                <div>
                  <label
                    className="block mb-1 text-fadedPurple text-sm"
                    htmlFor={`quantity-${index + 1}`}
                  >
                    Qty.
                  </label>
                  <input
                    type="number"
                    id={`quantity-${index + 1}`}
                    defaultValue={item.quantity}
                    className="custom-input border-lightGray dark:border-darkBlue"
                    onChange={(e) => handleQtyChange(e.target.value, index)}
                    onFocus={(e) => handleFocus(e.target)}
                    onBlur={() => refreshBorder()}
                  />
                </div>

                <div className="col-span-2">
                  <label
                    className="block mb-1 text-fadedPurple text-sm"
                    htmlFor={`price-${index + 1}`}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id={`price-${index + 1}`}
                    defaultValue={item.price}
                    className="custom-input border-lightGray dark:border-darkBlue"
                    onChange={(e) => handlePriceChange(e.target.value, index)}
                    onFocus={(e) => handleFocus(e.target)}
                    onBlur={() => refreshBorder()}
                  />
                </div>

                <div className="col-span-2">
                  <p className="mb-1 text-fadedPurple text-sm">Total</p>
                  <div className="flex items-center h-10 text-darkerGray font-bold text-[15px]">
                    {item.total.toFixed(2)}
                  </div>
                </div>

                <button
                  className="remove-item-btn grid place-items-center self-center h-10"
                  onClick={() => removeItem(index)}
                >
                  <MdDelete className="remove-icon w-6 h-6 text-darkerGray" />
                </button>
              </div>
            </div>
          ))}

          <button className="button-6" onClick={() => addNewItem()}>
            <img src="/icon-plus.svg" />
            Add New Item
          </button>

          <p
            ref={allFieldAlert}
            className="invisible mt-7 text-red text-sm font-semibold"
          >
            -All fields must be added
          </p>
          {!items.length && (
            <p ref={itemAlert} className="text-red text-sm font-semibold">
              -An item must be added
            </p>
          )}
        </fieldset>
      </form>

      <div className="fixed bottom-0 flex justify-center items-center gap-x-2 w-full h-20 px-5 custom-shadow bg-white dark:bg-dark dark:shadow-none">
        <button className="button-3" onClick={() => handleCreate(false)}>
          Discard
        </button>
        <button className="button-4" onClick={() => handleDraftOrSave("draft")}>
          Save as Draft
        </button>
        <button className="button-2" onClick={() => checkIfEveryInputIsValid()}>
          Save & Send
        </button>
      </div>
    </div>
  );
}

export default CreateInvoice;
