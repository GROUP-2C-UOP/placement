//for constant values that are used throughout the app

export const ACCESS_TOKEN = "access"; 
export const REFRESH_TOKEN = "refresh";

export const statusLabels = { //object mapping application statuses to user friendly labels for display in the UI
  applied: "Applied",
  phone_interview: "Phone Interview",
  face_to_face_interview: "Face to Face Interview",
  assessment: "Assessment",
  rejected: "Rejected",
  offer_made: "Offer Made",
  withdrawn: "Withdrawn",
};

export const icons = { //object mapping icons to be used in the ui
  applied: {
    id: "appl",
    class: "icons",
    title: "Applied",
    src: "/src/assets/applied.svg",
  },
  assessment: {
    id: "exam",
    class: "icons",
    title: "Assessment",
    src: "/src/assets/exam.svg",
  },
  face_to_face_interview: {
    id: "ttm",
    class: "icons",
    title: "Face to Face",
    src: "/src/assets/ttm.svg",
  },
  phone_interview: {
    id: "phone",
    class: "icons",
    title: "Virtual Interview",
    src: "/src/assets/phone.svg",
  },
  rejected: { id: null, class: null, title: null, src: null },
  offer_made: { id: null, class: null, title: null, src: null },
  hired: { id: null, class: null, title: null, src: null },
  withdrawn: { id: null, class: null, title: null, src: null },
};
