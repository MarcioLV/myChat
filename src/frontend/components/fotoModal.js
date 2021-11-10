import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import userImg from "../assets/icons/user.png";
import closeIcon from "../assets/icons/cerrar-icon.png";

import "./style/fotoModal.css";

import config from '../config'
const API_URL = `${config.api.host}/api/`

import { AppContext } from "../context/AppProvider";

function FotoModal(props) {
  if (!props.isOpened) {
    return null;
  }

  //uso en el frontend
  const [file, setFile] = useState();
  //lo que mando
  const [imagen, setImagen] = useState();
  const [locked, setLocked] = useState(false);

  const { setAvatar } = useContext(AppContext);

  const closeModal = () => {
    props.onClose();
  };

  const change = (e) => {
    if (e.target.files.length > 0) {
      let img = e.target.files[0];

      let reader = new FileReader();
      let image = new Image();

      reader.onload = function (f) {
        image.src = f.target.result;
        image.onload = async function () {
          const MAX_WIDTH = 210;
          const MAX_HEIGHT = 210;
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          image.width = width;
          image.height = height;
          setFile(image);

          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          const blob = await new Promise((rs) => canvas.toBlob(rs, 1));
          const resizedFile = await new File([blob], img.name, img);

          setImagen(resizedFile);
        };
      };
      reader.readAsDataURL(img);
    }
  };

  const handleSubmit = async () => {
    let avatar;
    if (!locked) {
      if (!imagen) {
        alert("No subio ninguna imagen");
      } else {
        avatar = imagen;
      }
    }
    let formdata = new FormData();
    formdata.append("avatar", avatar);
    const response = await fetchUserAvatar(props.userId, formdata);
    if (response.error) {
      alert("Ocurrio un error");
    } else {
      setAvatar(response.body.file);
      closeModal();
    }
  };

  const fetchUserAvatar = async (user, info) => {
    try {
      let response = await fetch(`${API_URL}user/${user}`, {
        method: "POST",
        mode: "cors",
        body: info,
      });
      response = await response.json();
      return response;
    } catch (err) {
      alert("Hubo un error");
      console.error("[error]", err);
    }
  };

  let avatar;
  let style;
  if (locked) {
    avatar = userImg;
  } else if (!file) {
    avatar = props.userAvatar;
  } else {
    avatar = file.src;
    style = { width: file.width, height: file.height };
  }

  return ReactDOM.createPortal(
    <div className="fotoModal">
      <div className="fotoModal-conteiner">
        <div className="fotoModal-header">
          <div className="fotoModal-header_titulo">
            <h1>Cambiar foto de perfil</h1>
          </div>
          <button className="closeButton" onClick={closeModal}>
            <img src={closeIcon} alt="" />
          </button>
        </div>
        <div className="fotoModal-user-imagen">
          <div className="fotoModal-user-imagen-avatar">
            <img src={avatar} alt="user-imagen" style={style} />
          </div>
        </div>
        <div className="fotoModal-section-input">
          <input
            type="file"
            accept="image/*"
            id="archivo"
            disabled={locked}
            style={{ display: "none" }}
            onChange={(e) => change(e)}
          />
          <button className={`filebutton ${locked && "filebutton-locked"}`}>
            <label htmlFor="archivo" className="label">
              Elegir foto
            </label>
          </button>

          <div className="fotoModal-section-input_eliminar">
            <input
              type="checkbox"
              name="img"
              id="delete"
              onChange={()=>setLocked(!locked)}
            />
            <label htmlFor="delete">
              <h4>Eliminar foto de perfil</h4>
            </label>
          </div>
        </div>
        <div className="fotoModal-button">
          <button className="fotoModal-button_cancelar" onClick={closeModal}>
            Cancelar
          </button>
          <button className="fotoModal-button_aceptar" onClick={handleSubmit}>
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default FotoModal;
