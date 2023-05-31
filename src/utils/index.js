

// const dropdownRef = useRef(null);

// const [isShowDropdown, setIsShowDropdown] = useState(false);

// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsShowDropdown(false);
//     }
//   };
//   document.addEventListener("mousedown", handleClickOutside);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);


// export const convertBase64ToImage = (base64, filename, type) => {
//   return fetch(base64)
//     .then(function (res) {
//       return res.arrayBuffer();
//     })
//     .then(function (buf) {
//       return new File([buf], filename, { type: type });
//     });
// };