'use client'
import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Hamburger from "./components/Hamburger";
import Main from "./components/Main";
import DarkMode from "./components/DarkMode";
import defaultData from './db/data.json';

export default function Home() {
  const [data, setData] = useState(defaultData);
  const [activeDocument, setActiveDocument] = useState(defaultData[1]);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("markdown");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      if (parsedData.length > 0 && storedData !== JSON.stringify(defaultData)) {
        setActiveDocument(parsedData[0]);
      }
    } else {
      localStorage.setItem("markdown", JSON.stringify(defaultData));
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleNameChange = (e) => {
    // Check if the name ends with .md
    const name = e.target.innerText.endsWith('.md') ? e.target.innerText : e.target.innerText + '.md';
    const updatedDocument = { ...activeDocument, name };
    setActiveDocument(updatedDocument);
    const updatedData = data.map((doc) => (doc.id === activeDocument.id ? updatedDocument : doc));
    setData(updatedData);
    localStorage.setItem("markdown", JSON.stringify(updatedData));
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleSave = () => {
    const updatedData = data.map((doc) => (doc.id === activeDocument.id ? activeDocument : doc));
    setData(updatedData);
    localStorage.setItem("markdown", JSON.stringify(updatedData));
    toast.success(`${activeDocument.name} has been saved successfully.`);
  }

  const handleDelete = () => {
    if (activeDocument.name === "untitled-document.md" && data.length === 1) {
      setShowModal(false);
      toast.error("This document cannot be deleted.");
      return;
    }

    let updatedData = data.filter((doc) => doc.id !== activeDocument.id);
    if (updatedData.length === 0) {
      const newDoc = {
        "id": 1,
        "createdAt": new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        "name": "untitled-document.md",
        "content": ""
      };

      updatedData = [newDoc];
    }

    setData(updatedData);
    setActiveDocument(updatedData[0]);
    localStorage.setItem("markdown", JSON.stringify(updatedData));
    setShowModal(false);
    toast.error(`${activeDocument.name} has been deleted successfully.`);
  }

  const handleContentChange = (content) => {
    const updatedDoc = { ...activeDocument, content };
    setActiveDocument(updatedDoc);
  }

  const createDocument = () => {
    const storedData = localStorage.getItem("markdown");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const id = parsedData[parsedData.length - 1] ? parsedData[parsedData.length - 1].id + 1 : 1;
      const newDoc = {
        "id": id,
        "createdAt": new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        "name": "untitled-document.md",
        "content": ""
      };

      const updatedData = [...parsedData, newDoc];
      setData(updatedData);
      setActiveDocument(newDoc);
      localStorage.setItem("markdown", JSON.stringify(updatedData));
    }
  }

  const handleShowModal = () => {
    setShowModal(!showModal);
  }

  return (
    <>
      {/* Sidebar */}
      <aside className="min-w-[250px] px-6 py-7 bg-neutral-900 h-dvh flex flex-col justify-between transition-all duration-300 ease-in-out group-[.activeSidebar]:ml-0 -ml-[250px]">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <a href="/" className="block mb-7 md:hidden">
            <span className="sr-only">Logo</span>
            <svg width="130" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M.75 11c.075-.56.147-1.12.218-1.68.07-.56.145-1.168.224-1.823l.443-3.585c.085-.645.163-1.255.232-1.83L2.086.305h2.497c.24.61.47 1.193.687 1.75.217.558.433 1.112.649 1.662l1.274 3.27h.165l1.238-3.262.626-1.65c.208-.546.427-1.136.656-1.77h2.468a1660.544 1660.544 0 0 0 .457 3.615l.458 3.6c.08.65.156 1.25.229 1.8.072.55.143 1.11.213 1.68h-2.347c-.09-.75-.178-1.463-.263-2.138-.085-.675-.162-1.308-.232-1.897l-.315-2.535h-.165l-.93 2.722c-.225.67-.451 1.334-.679 1.991-.227.658-.439 1.276-.634 1.856H6.502a322.988 322.988 0 0 0-.952-2.523c-.17-.448-.337-.887-.502-1.317L4.013 4.43h-.165L3.54 6.95c-.07.595-.146 1.232-.229 1.91l-.258 2.14H.75Zm19.017 0a578.89 578.89 0 0 0 1.186-3.623L22.16 3.71c.215-.665.41-1.264.585-1.797.175-.532.35-1.069.525-1.609h3.18a469.731 469.731 0 0 0 1.11 3.406l1.193 3.675c.195.59.393 1.197.596 1.822l.581 1.792h-2.55a515.072 515.072 0 0 0-.982-3.45l-1.47-5.152h-.18l-1.486 5.1c-.16.555-.328 1.136-.506 1.744l-.514 1.758h-2.475Zm2.58-2.236.263-1.845h4.777l.21 1.846h-5.25ZM36.28 11V.303h4.103c.87 0 1.606.097 2.208.29.603.192 1.06.513 1.373.963.312.45.468 1.063.468 1.838 0 .615-.12 1.167-.363 1.657s-.632.878-1.166 1.163c-.535.284-1.236.427-2.1.427l.952-.9 1.455 2.145.72 1.061.746 1.103c.243.357.456.673.642.948H42.52c-.27-.42-.53-.822-.78-1.207-.25-.385-.492-.76-.727-1.125l-1.733-2.73 1.462 1.117H38.26V5.293h1.785c.4 0 .736-.049 1.009-.146.272-.098.478-.264.618-.499s.21-.558.21-.968c0-.304-.044-.55-.134-.738a1.092 1.092 0 0 0-.364-.439 1.314 1.314 0 0 0-.51-.21 3.08 3.08 0 0 0-.567-.052h-3.36L38.703.694V11H36.28Zm21.538 0c-.33-.476-.642-.922-.934-1.34-.293-.417-.579-.828-.859-1.233l-1.41-2.018h-.69V4.475h.66l1.26-1.65a293.263 293.263 0 0 0 1.92-2.52h2.843a323.846 323.846 0 0 0-2.693 3.315L56.22 5.712l-.045-1.088 1.883 2.603a1120.463 1120.463 0 0 1 1.904 2.633c.316.434.593.815.833 1.14h-2.977Zm-6.158 0V.303h2.46V11h-2.46Zm15.478 0V.303H71.39c.815 0 1.54.118 2.175.353.635.235 1.171.58 1.609 1.035a4.525 4.525 0 0 1 1.001 1.669c.23.657.345 1.408.345 2.253 0 .755-.101 1.46-.304 2.112a4.523 4.523 0 0 1-.967 1.713c-.443.49-1.026.873-1.751 1.148-.726.275-1.61.412-2.656.412H67.138Zm2.467-1.973h1.23c.77 0 1.381-.15 1.834-.45.452-.3.779-.71.978-1.23.2-.52.3-1.108.3-1.763 0-.494-.058-.944-.176-1.35a2.869 2.869 0 0 0-.54-1.046 2.374 2.374 0 0 0-.926-.675c-.375-.157-.823-.236-1.343-.236h-1.357V9.027Zm18.635 2.175c-.965 0-1.8-.149-2.505-.446-.705-.298-1.285-.705-1.74-1.223a5.116 5.116 0 0 1-1.016-1.773 6.574 6.574 0 0 1-.334-2.1c0-1.04.206-1.982.619-2.824A4.743 4.743 0 0 1 85.109.83c.817-.495 1.839-.743 3.064-.743.93 0 1.742.144 2.437.431a4.759 4.759 0 0 1 1.736 1.196c.463.51.809 1.1 1.039 1.77.23.67.345 1.39.345 2.16 0 1.065-.211 2.015-.634 2.85a4.769 4.769 0 0 1-1.856 1.98c-.815.486-1.815.728-3 .728Zm-.037-2.033c.495 0 .927-.093 1.297-.28.37-.188.677-.447.922-.777.246-.33.43-.706.552-1.129.122-.422.183-.869.183-1.338 0-.495-.066-.957-.198-1.384a3.428 3.428 0 0 0-.578-1.121 2.67 2.67 0 0 0-.926-.75 2.796 2.796 0 0 0-1.252-.27c-.486 0-.914.092-1.287.277a2.63 2.63 0 0 0-.933.769c-.25.327-.44.704-.57 1.128a4.59 4.59 0 0 0-.195 1.35c0 .475.062.924.187 1.347.125.422.311.797.559 1.125.247.327.557.585.93.772.372.188.808.281 1.308.281ZM102.105 11l-.45-1.698c-.16-.603-.31-1.162-.45-1.677l-.885-3.36a559.983 559.983 0 0 1-1.05-3.96h2.782a1464.078 1464.078 0 0 0 .855 4.125l.743 3.638h.188l.765-3.683c.09-.42.183-.863.28-1.33l.297-1.407.285-1.343h2.632a1211.281 1211.281 0 0 0 .886 4.095l.794 3.668h.18l.758-3.69c.13-.63.269-1.307.416-2.032l.416-2.04h2.79c-.175.635-.356 1.302-.543 2.002-.188.7-.361 1.345-.522 1.935l-.915 3.382c-.144.53-.297 1.096-.457 1.696-.16.6-.313 1.16-.458 1.68h-3c-.14-.6-.287-1.23-.442-1.887-.155-.657-.3-1.284-.435-1.878l-.795-3.39h-.188l-.764 3.39c-.13.59-.272 1.217-.424 1.882-.153.665-.297 1.292-.431 1.882h-2.858Zm18.605 0V.304h2.153c.5.73.972 1.42 1.417 2.067l1.335 1.946 1.74 2.52h.18V.304h2.317V11h-2.13c-.41-.6-.84-1.225-1.29-1.875l-1.477-2.13-1.763-2.55h-.172V11h-2.31Z" fill="#FFF" /></svg>
          </a>
          <h1 className="text-sm font-medium text-neutral-500">MY DOCUMENTS</h1>
          {/* New Document Button */}
          <button type="button" className="w-full py-2 text-white rounded cursor-pointer bg-orange-dark my-7 hover:bg-orange-light" onClick={createDocument}>+ New Document</button>
          <ul className="flex flex-col h-full gap-6 mb-4 overflow-y-auto doc-list-scroll-bar">
            {data.map((document) => (
              <li key={document.id}>
                <div className="flex items-center gap-3 cursor-pointer group/item" onClick={() => setActiveDocument(document)}>
                  <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M13.107 3.393c.167.167.31.393.429.678.119.286.178.548.178.786v10.286c0 .238-.083.44-.25.607a.827.827 0 0 1-.607.25h-12a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V.857C0 .62.083.417.25.25A.827.827 0 0 1 .857 0h8c.238 0 .5.06.786.179.286.119.512.261.678.428l2.786 2.786ZM9.143 1.214v3.357H12.5c-.06-.172-.125-.294-.196-.366L9.509 1.411c-.072-.072-.194-.137-.366-.197Zm3.428 13.643V5.714H8.857a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V1.143H1.143v13.714H12.57Z" fill="#FFF" /></svg>
                  <div className="text-start">
                    <h3 className="text-sm font-light text-neutral-500">{new Date(document.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</h3>
                    <p className={`${document.id == activeDocument.id ? 'text-orange-dark' : 'text-neutral-100'} group-hover/item:text-orange-dark`}>{document.name}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Dark/Light Mode */}
        <DarkMode />
      </aside>
      {/* Main */}
      <div className="flex flex-col min-h-screen w-dvw">
        {/* Header */}
        <header className="flex w-full bg-neutral-800 md:min-w-3xl">
          {/* Hamburger */}
          <Hamburger />
          <div className="flex w-full px-4 py-4 md:px-6">
            <div className="flex items-center flex-grow md:gap-5 md:divide-x-2 md:divide-neutral-600">
              {/* Logo */}
              <a href="/" className="hidden md:block">
                <span className="sr-only">Logo</span>
                <svg width="130" height="12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.75 11c.075-.56.147-1.12.218-1.68.07-.56.145-1.168.224-1.823l.443-3.585c.085-.645.163-1.255.232-1.83L2.086.305h2.497c.24.61.47 1.193.687 1.75.217.558.433 1.112.649 1.662l1.274 3.27h.165l1.238-3.262.626-1.65c.208-.546.427-1.136.656-1.77h2.468a1660.544 1660.544 0 0 0 .457 3.615l.458 3.6c.08.65.156 1.25.229 1.8.072.55.143 1.11.213 1.68h-2.347c-.09-.75-.178-1.463-.263-2.138-.085-.675-.162-1.308-.232-1.897l-.315-2.535h-.165l-.93 2.722c-.225.67-.451 1.334-.679 1.991-.227.658-.439 1.276-.634 1.856H6.502a322.988 322.988 0 0 0-.952-2.523c-.17-.448-.337-.887-.502-1.317L4.013 4.43h-.165L3.54 6.95c-.07.595-.146 1.232-.229 1.91l-.258 2.14H.75Zm19.017 0a578.89 578.89 0 0 0 1.186-3.623L22.16 3.71c.215-.665.41-1.264.585-1.797.175-.532.35-1.069.525-1.609h3.18a469.731 469.731 0 0 0 1.11 3.406l1.193 3.675c.195.59.393 1.197.596 1.822l.581 1.792h-2.55a515.072 515.072 0 0 0-.982-3.45l-1.47-5.152h-.18l-1.486 5.1c-.16.555-.328 1.136-.506 1.744l-.514 1.758h-2.475Zm2.58-2.236.263-1.845h4.777l.21 1.846h-5.25ZM36.28 11V.303h4.103c.87 0 1.606.097 2.208.29.603.192 1.06.513 1.373.963.312.45.468 1.063.468 1.838 0 .615-.12 1.167-.363 1.657s-.632.878-1.166 1.163c-.535.284-1.236.427-2.1.427l.952-.9 1.455 2.145.72 1.061.746 1.103c.243.357.456.673.642.948H42.52c-.27-.42-.53-.822-.78-1.207-.25-.385-.492-.76-.727-1.125l-1.733-2.73 1.462 1.117H38.26V5.293h1.785c.4 0 .736-.049 1.009-.146.272-.098.478-.264.618-.499s.21-.558.21-.968c0-.304-.044-.55-.134-.738a1.092 1.092 0 0 0-.364-.439 1.314 1.314 0 0 0-.51-.21 3.08 3.08 0 0 0-.567-.052h-3.36L38.703.694V11H36.28Zm21.538 0c-.33-.476-.642-.922-.934-1.34-.293-.417-.579-.828-.859-1.233l-1.41-2.018h-.69V4.475h.66l1.26-1.65a293.263 293.263 0 0 0 1.92-2.52h2.843a323.846 323.846 0 0 0-2.693 3.315L56.22 5.712l-.045-1.088 1.883 2.603a1120.463 1120.463 0 0 1 1.904 2.633c.316.434.593.815.833 1.14h-2.977Zm-6.158 0V.303h2.46V11h-2.46Zm15.478 0V.303H71.39c.815 0 1.54.118 2.175.353.635.235 1.171.58 1.609 1.035a4.525 4.525 0 0 1 1.001 1.669c.23.657.345 1.408.345 2.253 0 .755-.101 1.46-.304 2.112a4.523 4.523 0 0 1-.967 1.713c-.443.49-1.026.873-1.751 1.148-.726.275-1.61.412-2.656.412H67.138Zm2.467-1.973h1.23c.77 0 1.381-.15 1.834-.45.452-.3.779-.71.978-1.23.2-.52.3-1.108.3-1.763 0-.494-.058-.944-.176-1.35a2.869 2.869 0 0 0-.54-1.046 2.374 2.374 0 0 0-.926-.675c-.375-.157-.823-.236-1.343-.236h-1.357V9.027Zm18.635 2.175c-.965 0-1.8-.149-2.505-.446-.705-.298-1.285-.705-1.74-1.223a5.116 5.116 0 0 1-1.016-1.773 6.574 6.574 0 0 1-.334-2.1c0-1.04.206-1.982.619-2.824A4.743 4.743 0 0 1 85.109.83c.817-.495 1.839-.743 3.064-.743.93 0 1.742.144 2.437.431a4.759 4.759 0 0 1 1.736 1.196c.463.51.809 1.1 1.039 1.77.23.67.345 1.39.345 2.16 0 1.065-.211 2.015-.634 2.85a4.769 4.769 0 0 1-1.856 1.98c-.815.486-1.815.728-3 .728Zm-.037-2.033c.495 0 .927-.093 1.297-.28.37-.188.677-.447.922-.777.246-.33.43-.706.552-1.129.122-.422.183-.869.183-1.338 0-.495-.066-.957-.198-1.384a3.428 3.428 0 0 0-.578-1.121 2.67 2.67 0 0 0-.926-.75 2.796 2.796 0 0 0-1.252-.27c-.486 0-.914.092-1.287.277a2.63 2.63 0 0 0-.933.769c-.25.327-.44.704-.57 1.128a4.59 4.59 0 0 0-.195 1.35c0 .475.062.924.187 1.347.125.422.311.797.559 1.125.247.327.557.585.93.772.372.188.808.281 1.308.281ZM102.105 11l-.45-1.698c-.16-.603-.31-1.162-.45-1.677l-.885-3.36a559.983 559.983 0 0 1-1.05-3.96h2.782a1464.078 1464.078 0 0 0 .855 4.125l.743 3.638h.188l.765-3.683c.09-.42.183-.863.28-1.33l.297-1.407.285-1.343h2.632a1211.281 1211.281 0 0 0 .886 4.095l.794 3.668h.18l.758-3.69c.13-.63.269-1.307.416-2.032l.416-2.04h2.79c-.175.635-.356 1.302-.543 2.002-.188.7-.361 1.345-.522 1.935l-.915 3.382c-.144.53-.297 1.096-.457 1.696-.16.6-.313 1.16-.458 1.68h-3c-.14-.6-.287-1.23-.442-1.887-.155-.657-.3-1.284-.435-1.878l-.795-3.39h-.188l-.764 3.39c-.13.59-.272 1.217-.424 1.882-.153.665-.297 1.292-.431 1.882h-2.858Zm18.605 0V.304h2.153c.5.73.972 1.42 1.417 2.067l1.335 1.946 1.74 2.52h.18V.304h2.317V11h-2.13c-.41-.6-.84-1.225-1.29-1.875l-1.477-2.13-1.763-2.55h-.172V11h-2.31Z" fill="#FFF" />
                </svg>
              </a>
              {/* Divider */}
              <div className="hidden w-1 h-full md:block"></div>
              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center flex-grow gap-3">
                <svg width="14" height="16" className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.107 3.393c.167.167.31.393.429.678.119.286.178.548.178.786v10.286c0 .238-.083.44-.25.607a.827.827 0 0 1-.607.25h-12a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V.857C0 .62.083.417.25.25A.827.827 0 0 1 .857 0h8c.238 0 .5.06.786.179.286.119.512.261.678.428l2.786 2.786ZM9.143 1.214v3.357H12.5c-.06-.172-.125-.294-.196-.366L9.509 1.411c-.072-.072-.194-.137-.366-.197Zm3.428 13.643V5.714H8.857a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V1.143H1.143v13.714H12.57Z" fill="#FFF" />
                </svg>
                <div className="flex-grow">
                  <h3 className="hidden text-sm font-light text-neutral-500 md:block">Document Name</h3>
                  <p
                    className="text-neutral-100 line-clamp-1 caret-orange-dark break-all focus:outline-none focus:border-b-2 focus:border-neutral-400 focus:ring-0 max-w-[400px]"
                    contentEditable
                    onKeyDown={handleKeyDown}
                    onBlur={handleNameChange}
                    suppressContentEditableWarning
                  >
                    {activeDocument.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Delete Button */}
              <button type="button" className="cursor-pointer text-neutral-500 hover:text-orange-dark" onClick={handleShowModal}>
                <svg width="18" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 16a1 1 0 0 0 1-1V9a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM17 4h-4V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H1a1 1 0 1 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6h1a1 1 0 0 0 0-2ZM7 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1H7V3Zm7 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6h10v11Zm-3-1a1 1 0 0 0 1-1V9a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z" fill="currentColor" />
                </svg>
                <span className="sr-only">Delete</span>
              </button>
              {/* Save Changes */}
              <button type="button" className="flex items-center gap-2 px-4 py-2 text-white rounded cursor-pointer bg-orange-dark hover:bg-orange-light" onClick={handleSave}>
                <svg width="17" height="17" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.91 5.931 10.575.598A.889.889 0 0 0 10.29.41.969.969 0 0 0 9.945.34H2.834A2.667 2.667 0 0 0 .167 3.007v10.666a2.667 2.667 0 0 0 2.667 2.667H13.5a2.667 2.667 0 0 0 2.667-2.667v-7.11a.889.889 0 0 0-.258-.632ZM5.5 2.118h3.556v1.778H5.5V2.118Zm5.334 12.444H5.5v-2.666c0-.491.398-.89.89-.89h3.555c.49 0 .889.399.889.89v2.666Zm3.555-.889c0 .491-.398.89-.889.89h-.889v-2.667a2.667 2.667 0 0 0-2.666-2.667H6.389a2.667 2.667 0 0 0-2.666 2.667v2.666h-.89a.889.889 0 0 1-.888-.889V3.007c0-.491.398-.89.889-.89h.889v2.667c0 .491.398.89.888.89h5.334c.49 0 .889-.399.889-.89V3.371l3.555 3.556v6.746Z" fill="#FFF" />
                </svg>
                <span className="sr-only md:not-sr-only">Save Changes</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <Main content={activeDocument?.content || ""} onUpdate={handleContentChange} />
      </div >
      {/* Modal */}
      <div className={`fixed inset-0 z-50 px-4 flex items-center justify-center bg-black/50 ${showModal ? 'block' : 'hidden'}`} onClick={handleShowModal}>
        <div className="w-full max-w-sm p-6 rounded bg-neutral-100 dark:bg-neutral-900" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-100">Delete this document?</h3>
          <p className="my-4 text-sm text-neutral-500 dark:text-neutral-400">Are you sure you want to delete ‘welcome.md’ document and its contents? This action cannot be reversed.</p>
          <button type="button" className="w-full py-2 text-white rounded cursor-pointer bg-orange-dark hover:bg-orange-light" onClick={handleDelete}>Confirm & Delete</button>
        </div>
      </div>
      {/* Toast Notification */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}
