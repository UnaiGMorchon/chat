import React, { useState } from "react";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");

  const handleTyping = () => {
    socket.emit("typing", `${localStorage.getItem("userName")} is typing`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      //quita los espacios y mira si hay user conecado
      socket.emit("message", {
        //saber q tipo de evento emit usuarario escribiendo etc
        text: message, //envia  objeto como texto usuario y los dos ids
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`, // genera un id y id aleatorio de socket cada vez q entras te cambia el id como no se guarad en la base de datos sino se podria usar userid
        socketID: socket.id,
      });
    }
    socket.emit("typing", "");
    setMessage("");
  };

  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        <input
          type='text'
          placeholder='Write message'
          className='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping} //OnKeyDown function
        />
        <button className='sendBtn'>SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
