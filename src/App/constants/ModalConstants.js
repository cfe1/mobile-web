const ModalInitialState = {
  isOpen: false,
  actionType: null, // can be add, edit , delete, view
  data: null,
};
const ModalTypes = {
  ADD: "ADD",
  EDIT: "EDIT",
  DELETE: "DELETE",
  VIEW: "VIEW",
  VIEW1: "VIEW1",
  VIEW2: "VIEW2",
  VIEW3: "VIEW3",
  VIEW4: "VIEW4",
};

const TWO_DECIMAL_REGEX = /^\d*\.?\d{0,2}$/;

export { ModalInitialState, ModalTypes, TWO_DECIMAL_REGEX };
