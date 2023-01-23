import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Input, message } from "antd";
import axios from "axios";
import "./employee.css";

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState("");
  const [input, setInput] = useState({
    name: "",
    email: "",
    salary: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!isEditing) {
      try {
        await axios.post(
          `${process.env.REACT_APP_APIBASE}/employee/add-employee`,
          input
        );
        message.success("Employee Added successfully");
        fetchApi();
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await axios.put(
          `${process.env.REACT_APP_APIBASE}/employee/${editingUserId}`,
          input
        );
        message.success("Employee Updated successfully");
        fetchApi();
      } catch (e) {
        console.log(e);
      }
      setIsEditing(false);
    }

    setInput({
      name: "",
      salary: "",
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const AddEmployee = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const deleteHandler = async (e) => {
    try {
      await axios.delete(`${process.env.REACT_APP_APIBASE}/employee/${e}`);
      message.success("Employee deleted successfully");
      fetchApi();
    } catch (e) {
      console.log(e);
    }
  };

  const editHandler = async (id) => {
    const EditableData = data.find((e) => e._id === id);
    console.log(EditableData);
    setInput({
      name: EditableData.name,
      salary: EditableData.salary,
      email: EditableData.email,
    });
    showModal();
    setIsEditing(true);
    setEditingUserId(id);
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Employee Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => (
        <div className="buttons">
          <Button onClick={() => deleteHandler(_id)}>Delete</Button>
          <Button onClick={() => editHandler(_id)}>Edit</Button>
        </div>
      ),
    },
  ];

  const fetchApi = async () => {
    try {
      const employeeList = await axios.get(
        `${process.env.REACT_APP_APIBASE}/employee`
      );
      setData(employeeList.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <>
      <div className="title_div">
        <h1>Employee List</h1>
        <Button type="primary" onClick={showModal}>
          Add Employee
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Add Employee"
        okText={!isEditing ? "Add" : "Edit"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="form_data">
          <div className="input_field">
            Name :{" "}
            <Input
              placeholder="Employee Name"
              name="name"
              value={input.name}
              onChange={(e) => AddEmployee(e)}
            />
          </div>
          <div className="input_field">
            Email :{" "}
            <Input
              placeholder="Employee email"
              name="email"
              value={input.email}
              onChange={(e) => AddEmployee(e)}
            />
          </div>
          <div className="input_field">
            Salary :{" "}
            <Input
              placeholder="Employee salary"
              name="salary"
              value={input.salary}
              onChange={(e) => AddEmployee(e)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeList;
