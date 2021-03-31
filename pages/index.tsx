import React, { useState, useContext } from "react";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Context as JoplinContext } from "../src/context/Joplin";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    },

    row1: {
      "& > *": {
        width: "100%",
        marginTop: 30,
      },
    },

    row2: {
      marginTop: 40,
      display: "flex",
    },

    urlField: {
      width: "100%",
      marginLeft: 3,
      marginRight: 3,
    },

    row3: {
      marginTop: 40,
      marginBottom: 10,
      padding: 10,
      flex: 1,
      overflow: "auto",
      border: "1px solid #ccc",
    },
  })
);

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export default function Home() {
  const classes = useStyles();
  const { joplin, setJoplin } = useContext(JoplinContext);
  const [method, setMethod] = useState<Method>(Method.GET);
  const [url, setUrl] = useState<string>("/ping");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleMethodChange = (event: React.ChangeEvent<{ value: Method }>) => {
    setMethod(event.target.value);
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newURL = new URL(`http://localhost:${joplin.port}${url}`);

      const params = { token: joplin.authToken };

      if (newURL.search === "") {
        newURL.search += new URLSearchParams(params).toString();
      } else {
        newURL.search += "&" + new URLSearchParams(params).toString();
      }

      const result = await fetch(newURL.href, {
        method: method,
      });

      const data = await result.text();
      setResult(data);
    } catch (err) {
      if (err.response) {
        console.log(err);
      } else {
        alert("Enable Clipper Server");
        console.log(err);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Joplin Api Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CssBaseline />
      <Container maxWidth="sm">
        <form className={classes.form} noValidate autoComplete="off">
          <div className={classes.row1}>
            <TextField
              type="text"
              label="Authorization Token"
              value={joplin.authToken}
              onChange={(e) =>
                setJoplin((prevState) => ({
                  ...prevState,
                  authToken: e.target.value,
                }))
              }
            />
            <TextField
              type="number"
              label="Clipper Server Port"
              value={joplin.port}
              onChange={(e) =>
                setJoplin((prevState) => ({
                  ...prevState,
                  port: e.target.value,
                }))
              }
            />
          </div>

          <div className={classes.row2}>
            <Select value={method} onChange={handleMethodChange}>
              <MenuItem value={Method.GET}>GET</MenuItem>
              <MenuItem value={Method.POST}>POST</MenuItem>
              <MenuItem value={Method.PUT}>PUT</MenuItem>
              <MenuItem value={Method.DELETE}>DELETE</MenuItem>
            </Select>
            <TextField
              className={classes.urlField}
              variant="filled"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={sendRequest}
              disabled={loading}
            >
              SEND
            </Button>
          </div>

          <div className={classes.row3}>
            <pre>{result}</pre>
          </div>
        </form>
      </Container>
    </div>
  );
}
