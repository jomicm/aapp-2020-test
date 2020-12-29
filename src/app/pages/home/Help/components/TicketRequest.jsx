import React from "react";
import{
  TextField,
  MenuItem,
  Slider,
  Typography
}from "@material-ui/core";
import "./TicketRequest.scss";

const valuetext = (value) => {
  return `${value}%`;
}

const marks = [
  {
    label: "0%",
    value: 0,
  },
  {
    label: "25%",
    value: 25,
  },
  {
    label: "50%",
    value: 50,
  },
  {
    label: "75%",
    value: 75,
  },
  {
    label: "100%",
    value: 100,
  },
];

const types = [
  {
    label: "Bug",
    value: "bug",
  },
  {
    label: "Question",
    value: "question",
  },
];

const TicketRequest = ({ values, setValues }) => {
  const { subject, message, peaceOfMind, selectedType } = values;
  const [subject2, setSubject] = React.useState("");
  const [type, setType] = React.useState("");
  const [message2, setMessage] = React.useState("");
  const [mindLevel, setMindLevel] = React.useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    setSubject("");
    setType("");
    setMessage("");
    setMindLevel(50);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <form className="__container-tr" onSubmit={handleSubmit}>
      <div className="__container-tr-left">
        <TextField
          id="outlined-email-input"
          label="Subject"
          name="subject"
          margin="normal"
          onChange={handleOnChange}
          style={{ width: "80%" }}
          type="text"
          value={subject}
        ></TextField>
        <TextField
          id="outlined-select-currency-native"
          label="Type"
          name="selectedType"
          onChange={handleOnChange}
          style={{ width: "80%" }}
          select
          value={selectedType}
        >
          {types.map((option) => (
            <MenuItem key={option.value} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          name="message"
          onChange={handleOnChange}
          rows={6}
          style={{ width: "80%" }}
          value={message}
        />
      </div>
      <div className="__container-tr-right">
        <Typography
          gutterBottom
          id="vertical-slider"
          style={{ textAlign: "center" }}
        >
          Peace of mind level
        </Typography>
        <p> {peaceOfMind}% </p>
        <Slider
          aria-labelledby="continuous-slider"
          marks={marks}
          onChange={(_, value) => setValues({ ...values, peaceOfMind: value })}
          orientation="vertical"
          style={{ height: "250px" }}
          value={peaceOfMind}
        />
      </div>
    </form>
  );
};

export default TicketRequest;
