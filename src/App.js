import React, { useState } from "react";
import {
  Card,
  Modal,
  Button,
  Input,
  Row,
  Col,
  Radio,
  Menu,
  Alert,
  Space,
  Tooltip,
  Select,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  addCard,
  deleteCard,
  editCard,
} from "./features/counter/cardSlice";
import style from "./App.module.css";
import { Categories } from "./data/data";

const { Option } = Select;

function App() {
  const dispatch = useDispatch();

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardLink, setCardLink] = useState("");
  const [newcardTitle, setNewCardTitle] = useState("");
  const [newcardLink, setNewCardLink] = useState("");
  const [cardId, setCardId] = useState(0);
  const [bucket, setBucket] = useState("");
  const [selectedBucket, setSelectedBucket] = useState("todo");

  const handleAddCardOk = () => {
    setIsAddCardModalOpen(false);
  };
  const handleAddCardCancel = () => {
    setIsAddCardModalOpen(false);
  };
  const handleEditCardCancel = () => {
    setIsEditCardModalOpen(false);
  };
  const handleAddCard = () => {
    setIsAddCardModalOpen(true);
  };
  const handleEditCard = () => {
    setIsEditCardModalOpen(true);
  };
  const handleCardTitleChange = (event) => {
    setCardTitle(event.target.value);
  };
  const handleCardLinkChange = (event) => {
    setCardLink(event.target.value);
  };
  const handleNewCardTitleChange = (event) => {
    setNewCardTitle(event.target.value);
  };
  const handleNewCardLinkChange = (event) => {
    if (event.target.value === "") {
    } else {
      setNewCardLink(event.target.value);
    }
  };
  const handleBucketChange = (event) => {
    setBucket(event.target.value);
  };
  const cardData = useSelector((state) => state.card);
  const [isModalopen, setIsModalopen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  function handleChange(selectedValues) {
    setSelectedOptions(selectedValues);
  }

  const options = cardData.map((card) => ({
    label: card.title,
    value: card.id,
  }));
  const [selectedOptionsAlert, setSelectedOptionsAlert] = useState("");// for multiple delete
  const handleClick = () => {
    setSelectedOptionsAlert(selectedOptions.join(", "));
    selectedOptions.forEach((element) => {
      dispatch(
        deleteCard({
          title: element,
        })
      );
    });
    setSelectedOptions([]);
  };

  return (
    <div className="App">
      <Card
        title="Card Title"
        style={{ width: "100%" }}
        extra={
          <Space size="middle">
            <Button onClick={handleAddCard}>Add Card</Button>
            <Select
              showSearch={false}
              mode="multiple"
              placeholder="select card to delete"
              onChange={handleChange}
              className={style.select}
              value={selectedOptions}
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.value)}
                    readOnly
                  />
                  {option.label}
                </Option>
              ))}
            </Select>
            <Button
              type="dashed"
              style={{ color: "red" }}
              onClick={handleClick}
            >
              Delete
            </Button>
          </Space>
        }
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["todo"]}
          style={{ marginBottom: 16 }}
          onClick={(e) => {
            setSelectedBucket(e.key);
          }}
        >
          {Categories.map((category) => (
            <Menu.Item key={category.bucket}>{category.bucket}</Menu.Item>
          ))}
        </Menu>
        <Row gutter={[16, 16]}>
          {cardData.map((card) => {

            if (card.bucket === selectedBucket ) {
              return (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card className={style.gridStyle} key={card.id}>
                    <Tooltip
                      title="click to open"
                      placement="leftBottom"
                      color="blue"
                      key="blue"
                    >
                      <Card
                        hoverable
                        style={{ marginBottom: "16px" }}
                        onClick={() => {setIsModalopen(true)
                          dispatch(editCard({
                            id: card.id,
                            title: card.title,
                            link: card.link,
                            bucket: card.bucket,
                            history : 1,
                            time : new Date().toLocaleString()
                          }))
                          // alert("history updated")
                        }

                        }
                      >
                        <h3>{card.title}</h3>
                        <p
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >{card.link}</p>
                      </Card>
                    </Tooltip>

                    <Modal
                      title="Open Content"
                      open={isModalopen}
                      onCancel={() => setIsModalopen(false)}
                      footer={null}
                      style={{ minWidth: 320, minHeight: '50vh', top: 20 }}
                      width={'80vw'}
                      bodyStyle={{ height: 'calc(100% - 64px)' }}

                    >
                      <iframe
                        src={card.link}
                        style={{
                          width: "100%",
                          height: "80vh",
                          border: "none",
                        }}

                        title="iframe"
                      />
                    </Modal>

                    <Space size="middle">
                      <Button
                        onClick={() => {
                          setIsEditCardModalOpen(true);
                          setCardId(card.id);
                          console.log(cardData[cardId].bucket);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          dispatch(
                            deleteCard({
                              title: card.id,
                            })
                          );
                          <>
                            <Alert message="Success Text" type="success" />
                          </>;
                        }}
                      >
                        Delete
                      </Button>
                      Bucket:
                      {card.bucket}
                    </Space>
                  </Card>
                </Col>
              );
            }
          // if history is selected
          else if (selectedBucket === "history" && card.history === 1) {
           return(
            <Col xs={24} sm={12} md={8} lg={6}>
            <Card >
              <h1>
                {card.title}
              </h1>
              <p>{card.link}</p>
              <p>{card.time}</p>
            </Card>
            </Col>
           );
          }


          })}
        </Row>
      </Card>

      <Modal
        title="Add Card"
        open={isAddCardModalOpen}
        onOk={() => {
          // set alert
          if (cardTitle === "" || cardLink === "") {
            alert("Please fill in all fields");
          } else {
            alert("Card added");
          }
          dispatch(
            addCard({
              title: cardTitle,
              link: cardLink,
              bucket: bucket,
              history : 0,
              time : 0
            })
          );
          setCardTitle("");
          setCardLink("");
        }}
        onCancel={handleAddCardCancel}
      >
                <Space
          direction="vertical"
          style={{ width: "100%" }}
          size={16}
        >
        <Input
          placeholder="Add card"
          value={cardTitle}
          onChange={handleCardTitleChange}
        />
        <Input.TextArea
          placeholder="Link"
          value={cardLink}
          onChange={handleCardLinkChange}
        />
        <Radio.Group
          onChange={(e) => {
            setBucket(e.target.value);
          }}
        >
          <Radio.Button value="todo">Todo</Radio.Button>
          <Radio.Button value="inprogress">In Progress</Radio.Button>
          <Radio.Button value="done">Done</Radio.Button>
        </Radio.Group>
        </Space>
      </Modal>

      <Modal
        title="Edit Card"
        open={isEditCardModalOpen}
        onOk={() => {
          if (newcardTitle === "" || newcardLink === "" || bucket === "") {
            alert("Please fill in all fields");
          }
          else{
            dispatch(
              editCard({
                id: cardId,
                title: newcardTitle,
                link: newcardLink,
                bucket: bucket,
              })
            );
          }
          setIsEditCardModalOpen(false);
          setNewCardTitle("");
          setNewCardLink("");
        }}
        onCancel={handleEditCardCancel}
      >
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          size={16}
        >
        <Input
          placeholder="title"
          value={newcardTitle}
          onChange={handleNewCardTitleChange}
        />
        <Input.TextArea
          placeholder="link"
          value={newcardLink}
          onChange={handleNewCardLinkChange}
        />
        <Radio.Group onChange={handleBucketChange}
          defaultValue={selectedBucket}
        >
          <Radio.Button value="todo">Todo</Radio.Button>
          <Radio.Button value="inprogress">In Progress</Radio.Button>
          <Radio.Button value="done">Done</Radio.Button>
        </Radio.Group>
        </Space>
      </Modal>
    </div>
  );
}

export default App;
