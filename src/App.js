import React, { useState } from 'react';
import { Card, Modal, Button, Input, Row, Col, Radio, Menu, Alert, Space,  Tooltip, Select,Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, deleteCard, editCard, moveCard } from './features/counter/cardSlice';
import style from './App.module.css';
import { Categories } from './data/data';

const { Option } = Select;

function App() {
  const dispatch = useDispatch();

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardLink, setCardLink] = useState('');
  const [newcardTitle, setNewCardTitle] = useState('');
  const [newcardLink, setNewCardLink] = useState('');
  const [cardId, setCardId] = useState(0);
  const [bucket, setBucket] = useState('');
  const [selectedBucket, setSelectedBucket] = useState('todo');

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
    if (event.target.value === '') {
    }
    else{
      setNewCardLink(event.target.value);
    }
  };
  const handleBucketChange = (event) => {
    setBucket(event.target.value);
  }
  const cardData = useSelector((state) => state.card);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  function handleChange(selectedValues) {
    setSelectedOptions(selectedValues);
  }


  const options = cardData.map((card) => ({
    label: card.title,
    value: card.id,
  }));
  const [selectedOptionsAlert, setSelectedOptionsAlert] = useState('');
  const handleClick = () => {
    setSelectedOptionsAlert(selectedOptions.join(', '));
    selectedOptions.forEach(element => {
      dispatch(deleteCard(
        {
          title: element,
        }
      ));
    });
  };



  return (
    <div className="App">

      <Card
        title="Card Title"
        style={{ width: '100%' }}
        extra={

          <Space
          size="middle"
          >
            <Button onClick={handleAddCard}>
              Add Card
            </Button>
            <Select
      mode="multiple"
      placeholder="Please select card to delete"
      onChange={handleChange}
      style={{ width: "200px" }}
      value={selectedOptions}

    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          <input type="checkbox" checked={selectedOptions.includes(option.value)} readOnly />
          {option.label}
        </Option>
      ))}

    </Select>
    <Button
  onClick={handleClick}
>
  Click me
</Button>

            </Space>

        }
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['todo']}
          style={{ marginBottom: 16 }}
          onClick={(e) => {
            setSelectedBucket(e.key);
          }}>
          {Categories.map((category) => (
            <Menu.Item key={category.bucket}
            >
              {category.bucket}
            </Menu.Item>
          ))}
          </Menu>
        <Row gutter={[16, 16]}>
          {cardData.map((card) => {
            if (card.bucket === selectedBucket) {
              return (
                <Col xs={24} sm={12} md={8} lg={6}>


                <Card className={style.gridStyle}
                          key={card.id
                          }
                          >
                                    <Tooltip title="click to open" placement = "leftBottom" color='blue' key='blue'>
                          <Card


                            hoverable
                            style={{ marginBottom: '16px'}}
                              onClick={() => setIsModalVisible(true)}
                            >
                              <h3>{card.title}</h3>
                              <p>{card.link}</p>
                            </Card>
                            </Tooltip>

                            <Modal
                              title="Open Content"
                              visible={isModalVisible}
                              onCancel={() => setIsModalVisible(false)}
                              footer={null}
                            >

                              <iframe src={card.link} height='90%' width='90%' />
                            </Modal>

                            <Space size= "middle">
                            <Button
                            onClick={() =>{
                              setIsEditCardModalOpen(true);
                              setCardId(card.id);
                              console.log(cardData[cardId].bucket)
                            }

                            }>
                              Edit
                            </Button>

                            <Button
                            type='primary'
                            onClick={() => {
                              dispatch(deleteCard({
                                title: card.id,
                              }));
                              <>
                              <Alert message="Success Text" type="success" />

                              </>
                            }
                            }>
                              Delete
                            </Button>
                            Bucket:
                            {card.bucket}
                            </Space>

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
        onOk={
          () => {
            // set alert
            if (cardTitle === '' || cardLink === '') {
              alert('Please fill in all fields');
            }
            else {
              alert('Card added');
            }
            dispatch(addCard({
              title: cardTitle,
              link: cardLink,
              bucket: bucket,
            }));
            setCardTitle('');
            setCardLink('');
          }
        }
        onCancel={handleAddCardCancel}
      >
        <Input
          placeholder="Card title"
          value={cardTitle}
          onChange={handleCardTitleChange}
        />
        <Input.TextArea
          placeholder="Link"
          value={cardLink}
          onChange={handleCardLinkChange}
        />
        <Radio.Group
            onChange={
              (e) => {
                setBucket(e.target.value);
              }
            }
        >
          <Radio.Button value="todo"  >Todo</Radio.Button>
          <Radio.Button value="inprogress">In Progress</Radio.Button>
          <Radio.Button value="done">Done</Radio.Button>
        </Radio.Group>
        </Modal>

      <Modal
        title="Edit Card"
        open={isEditCardModalOpen}
        onOk={
          () => {
            dispatch(editCard({
              // set id as the id of the card to be edited
              id: cardId,
              title: newcardTitle,
              link: newcardLink,
              bucket: bucket,
            }));
            // if the card is added successfully, close the modal
            setIsEditCardModalOpen(false);
            // then reset the card title and link
            setNewCardTitle('');
            setNewCardLink('');
          }
        }
        onCancel={handleEditCardCancel}
      >
        <Input
          placeholder= 'title'
          value={newcardTitle}
          onChange={handleNewCardTitleChange}
        />
        <Input.TextArea
          placeholder='link'
          value={newcardLink}
          onChange={handleNewCardLinkChange}
        />
        <Radio.Group

          onChange={handleBucketChange}
        >
          <Radio.Button value="todo"  >Todo</Radio.Button>
          <Radio.Button value="inprogress">In Progress</Radio.Button>
          <Radio.Button value="done">Done</Radio.Button>
        </Radio.Group>

      </Modal>

    </div>
  );
}

export default App;
