import React, { useState, useEffect } from "react";

const Modals = () => {
  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  return (
    <main>
      <h1>React Modal</h1>
      <Modal show={show} handleClose={hideModal}>
        <p>Modal</p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis
          excepturi tenetur, recusandae modi impedit cumque dolor nihil, rem ab
          corrupti qui ipsa? Ratione sunt provident nisi neque dolorem veritatis
          eos.
        </p>
      </Modal>
      <button type="button" onClick={showModal}>
        Open
      </button>
    </main>
  );
};

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default Modals;
