import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

function Crud() {
  const [data, setData] = useState([]);
  const [nextId, setNextId] = useState(101);
  const [editingPost, setEditingPost] = useState(null);
  const dataInput = useRef({
    title: "",
    body: "",
  });

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      setData(response.data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const postData = {
      title: dataInput.current.title.value,
      body: dataInput.current.body.value,
      userId: 1,
    };

    if (editingPost) {
      axios
        .put(
          `https://jsonplaceholder.typicode.com/posts/${editingPost.id}`,
          postData
        )
        .then((response) => {
          const updatedPost = response.data;
          const updatedData = data.map((item) =>
            item.id === updatedPost.id ? updatedPost : item
          );
          setData(updatedData);
          setEditingPost(null);
        });
    } else {
      axios
        .post("https://jsonplaceholder.typicode.com/posts", postData)
        .then((response) => {
          const newPost = response.data;

          newPost.id = nextId;
          setNextId(nextId + 1);

          setData([...data, newPost]);
        });
    }

    dataInput.current.title.value = "";
    dataInput.current.body.value = "";
  }

  function editData(post) {
    dataInput.current.title.value = post.title;
    dataInput.current.body.value = post.body;
    setEditingPost(post);
  }

  function cancelEdit() {
    dataInput.current.title.value = "";
    dataInput.current.body.value = "";
    setEditingPost(null);
  }

  function deleteData(itemId) {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${itemId}`)
      .then(() => {
        const newData = data.filter((item) => item.id !== itemId);
        setData(newData);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          size="small"
          label="Title"
          inputRef={(ref) => (dataInput.current.title = ref)}
        />
        <TextField
          size="small"
          label="Body"
          inputRef={(ref) => (dataInput.current.body = ref)}
        />

        <Button variant="contained" type="submit">
          {editingPost ? "Update" : "Add"}
        </Button>
        {editingPost && (
          <Button variant="outlined" onClick={cancelEdit}>
            Cancel
          </Button>
        )}
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>TITLE</TableCell>
              <TableCell>BODY</TableCell>
              <TableCell>USER ID</TableCell>
              <TableCell>CRUD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.body}</TableCell>
                <TableCell>{item.userId}</TableCell>
                <TableCell>
                  <Button onClick={() => editData(item)}>Edit</Button>
                  <Button color="error" onClick={() => deleteData(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Crud;
