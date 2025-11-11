import React, { useState, useEffect } from 'react';
import { MdOutlineDone } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { IoClipboardOutline } from 'react-icons/io5';
import axios from 'axios';

function App() {
  // --- PHẦN LOGIC CÒN THIẾU ---

  // State để lưu trữ danh sách công việc
  const [todos, setTodos] = useState([]);
  // State để lưu nội dung công việc mới đang gõ
  const [newTodo, setNewTodo] = useState("");

  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  // Hàm để lấy danh sách công việc từ server
  const fetchTodos = async () => {
    try {
      // Gọi API để lấy dữ liệu
      const response = await axios.get('/api/todos');
      console.log("Dữ liệu công việc đã lấy:", response.data);
      // Cập nhật state với dữ liệu vừa lấy được
      setTodos(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công việc:", error);
    }
  };

  // Sử dụng useEffect để gọi fetchTodos khi component được mount
  useEffect(() => {
    fetchTodos();
  }, []);


  // Sửa tên hàm từ starEditing -> startEditing
  const startEditing = (todo) => {
    setEditTodoId(todo._id);
    setEditTodoText(todo.text);
  }




  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editTodoText
      })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)))
      setEditTodoId(null);
    } catch (error) {
      console.log("Error updating todo: ", error)
    }

  }


  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (error) {
      console.log("Error updating todo: ", error)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map((t) => t._id === id ? response.data : t));
    } catch (error) {
      console.log("Error toggline todo:", error);
    }
  };



  // Hàm xử lý khi submit form (thêm công việc mới)
  const addTodo = async (e) => {
    // Ngăn trang web tải lại khi submit form
    e.preventDefault();
    if (!newTodo.trim()) return; // Bỏ qua nếu input rỗng

    try {
      // Gửi yêu cầu POST đến server với nội dung task mới
      const response = await axios.post('/api/todos', { text: newTodo });

      // Cập nhật state 'todos' bằng cách thêm task mới (response.data) vào cuối danh sách
      // Đây chính là bước "update dữ liệu" trên giao diện
      setTodos([...todos, response.data]);

      // Xóa nội dung trong input sau khi thêm thành công
      setNewTodo("");
    } catch (error) { // <<< SỬA LỖI: Đã thêm {
      console.error("Lỗi khi thêm công việc:", error);
    } // <<< SỬA LỖI: Đã thêm }
  };

  // --- HẾT PHẦN LOGIC ---

  // Đây là phần JSX bạn đã cung cấp
  return (
    <div className="min-h-screen
    bg-gradient-to-br from-gray-50 to-gray-100
    flex flex-col items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center"
        >Task Manager</h1>

        <form onSubmit={addTodo}
          className='flex items-center gap-2 shadow-md border border-gray-200 p-2 rounded-lg mb-6'>

          <input
            className='flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400'
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='What needs to be done?'
            required
          />
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md
          font-medium cursor-pointer transition-colors'>
            Add Task
          </button>
        </form>
        <div className='mt-4'></div>
        {/* Phần hiển thị danh sách todos */}
        <div className='flex flex-col gap-3'>
          {todos.length === 0 ? (
            // Hiển thị khi không có task nào
            <div></div>
          ) : (
            // Dùng map để hiển thị danh sách task
            // Sắp xếp cho task mới nhất lên đầu (reverse)
            <div className='flex flex-col gap-4'>
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editTodoId === todo._id ? (
                    <div className='flex items-center gap-x-3'>
                      <input className='flex-1 p-3 border border-gray-200 outline-none focus:ring-2 
                      focus:ring-blue-300 text-gray-700 shadow-inner'
                        type="text" value={editTodoText} onChange=
                        {(e) => setEditTodoText(e.target.value)} />
                      <div className='flex gap-x-2'>
                        <button onClick={() => saveEdit(todo._id)}
                          className='px-4 py-2 bg-green-500
                      text-white rouded-lg hover:bg-green-600 cursor-pointer'>
                          <MdOutlineDone />
                        </button>
                        <button className='px-4 py-2 bg-red-500
                      text-white rouded-lg hover:bg-red-600 cursor-pointer'
                          onClick={() => setEditTodoId(null)}>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-x-4 overflow-hidden'>
                          <button onClick={() => toggleTodo(todo._id)}
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${todo.completed
                              ? 'bg-green-500 border-green-500'
                              : 'bg-white border-gray-400 hover:border-blue-400'
                              }`}
                          >
                            {todo.completed && <IoClipboardOutline />}
                          </button>
                          <span className='text-gray-800 truncate font-medium '>
                            {todo.text}
                          </span>
                        </div>
                        <div className='flex gap-x-2'>
                          <button className='p-2 text-blue-500 hover:text-blue-700 rounded-lg
                          hover:bg-blue-50 duration-200 '
                            onClick={() => startEditing(todo)}>
                            <MdModeEditOutline />
                          </button>
                          <button onClick={() => deleteTodo(todo._id)}
                            className='p-2 text-red-500 hover:text-red-700 rounded-lg
                          hover:bg-red-50 duration-200 '>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )

              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;