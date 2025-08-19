import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

const ComponentPlaygroundPage = () => {
  const [textInput, setTextInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [radio, setRadio] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [textArea, setTextArea] = useState('');
  const [range, setRange] = useState(50);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState('#000000');
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [tel, setTel] = useState('');
  const [url, setUrl] = useState('');
  const [number, setNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragItems, setDragItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [dropZone, setDropZone] = useState<string[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [tabActive, setTabActive] = useState(0);
  const [counter, setCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form submitted successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      setDropZone([...dropZone, draggedItem]);
      setDragItems(dragItems.filter(item => item !== draggedItem));
      setDraggedItem(null);
      toast.success(`${draggedItem} dropped!`);
    }
  };

  const resetDragDrop = () => {
    setDragItems(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    setDropZone([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8" data-testid="playground-title">
          QA Component Playground
        </h1>
        
        <div className="space-y-8">
          {/* Form Elements Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="form-section-title">Form Elements</h2>
            <form onSubmit={handleSubmit} data-testid="test-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Text Input */}
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                    Text Input
                  </label>
                  <input
                    type="text"
                    id="text-input"
                    data-testid="text-input"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter text here"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">
                    Email Input
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    data-testid="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="test@example.com"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">
                    Password Input
                  </label>
                  <input
                    type="password"
                    id="password-input"
                    data-testid="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>

                {/* Number Input */}
                <div>
                  <label htmlFor="number-input" className="block text-sm font-medium text-gray-700">
                    Number Input
                  </label>
                  <input
                    type="number"
                    id="number-input"
                    data-testid="number-input"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Tel Input */}
                <div>
                  <label htmlFor="tel-input" className="block text-sm font-medium text-gray-700">
                    Telephone Input
                  </label>
                  <input
                    type="tel"
                    id="tel-input"
                    data-testid="tel-input"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* URL Input */}
                <div>
                  <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
                    URL Input
                  </label>
                  <input
                    type="url"
                    id="url-input"
                    data-testid="url-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Search Input */}
                <div>
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700">
                    Search Input
                  </label>
                  <input
                    type="search"
                    id="search-input"
                    data-testid="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Search..."
                  />
                </div>

                {/* Date Input */}
                <div>
                  <label htmlFor="date-input" className="block text-sm font-medium text-gray-700">
                    Date Input
                  </label>
                  <input
                    type="date"
                    id="date-input"
                    data-testid="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label htmlFor="time-input" className="block text-sm font-medium text-gray-700">
                    Time Input
                  </label>
                  <input
                    type="time"
                    id="time-input"
                    data-testid="time-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Color Input */}
                <div>
                  <label htmlFor="color-input" className="block text-sm font-medium text-gray-700">
                    Color Input
                  </label>
                  <input
                    type="color"
                    id="color-input"
                    data-testid="color-input"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Select Dropdown */}
                <div>
                  <label htmlFor="select-dropdown" className="block text-sm font-medium text-gray-700">
                    Select Dropdown
                  </label>
                  <select
                    id="select-dropdown"
                    data-testid="select-dropdown"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Choose an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>

                {/* File Input */}
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
                    File Input
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    ref={fileInputRef}
                    data-testid="file-input"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600" data-testid="file-name">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* Range Slider */}
                <div className="col-span-2">
                  <label htmlFor="range-slider" className="block text-sm font-medium text-gray-700">
                    Range Slider: {range}
                  </label>
                  <input
                    type="range"
                    id="range-slider"
                    data-testid="range-slider"
                    min="0"
                    max="100"
                    value={range}
                    onChange={(e) => setRange(parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>

                {/* Textarea */}
                <div className="col-span-2">
                  <label htmlFor="textarea" className="block text-sm font-medium text-gray-700">
                    Textarea
                  </label>
                  <textarea
                    id="textarea"
                    data-testid="textarea"
                    rows={4}
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter multiple lines of text..."
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="checkbox"
                    data-testid="checkbox"
                    checked={checkbox}
                    onChange={(e) => setCheckbox(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="checkbox" className="ml-2 block text-sm text-gray-900">
                    Checkbox Option
                  </label>
                </div>

                {/* Radio Buttons */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Radio Buttons</p>
                  <div className="space-y-2">
                    {['option1', 'option2', 'option3'].map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="radio"
                          id={`radio-${option}`}
                          data-testid={`radio-${option}`}
                          name="radio-group"
                          value={option}
                          checked={radio === option}
                          onChange={(e) => setRadio(e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`radio-${option}`} className="ml-2 block text-sm text-gray-900">
                          Radio {option.charAt(option.length - 1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  data-testid="submit-button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>

          {/* Buttons Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="buttons-section-title">Buttons & Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                data-testid="primary-button"
                onClick={() => toast.success('Primary button clicked!')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Primary Button
              </button>
              <button
                data-testid="secondary-button"
                onClick={() => toast.success('Secondary button clicked!')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Secondary Button
              </button>
              <button
                data-testid="success-button"
                onClick={() => toast.success('Success!')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Success Button
              </button>
              <button
                data-testid="warning-button"
                onClick={() => toast('Warning!', { icon: '⚠️' })}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Warning Button
              </button>
              <button
                data-testid="danger-button"
                onClick={() => toast.error('Danger!')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Danger Button
              </button>
              <button
                data-testid="disabled-button"
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                Disabled Button
              </button>
              <button
                data-testid="loading-button"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
              >
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </button>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="interactive-section-title">Interactive Elements</h2>
            
            {/* Counter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Counter</h3>
              <div className="flex items-center gap-4">
                <button
                  data-testid="decrement-button"
                  onClick={() => setCounter(counter - 1)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <span data-testid="counter-value" className="text-xl font-bold">
                  {counter}
                </span>
                <button
                  data-testid="increment-button"
                  onClick={() => setCounter(counter + 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
                <button
                  data-testid="reset-counter"
                  onClick={() => setCounter(0)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Modal */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Modal</h3>
              <button
                data-testid="open-modal"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Open Modal
              </button>
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full" data-testid="modal">
                    <h3 className="text-lg font-bold mb-4">Modal Title</h3>
                    <p className="mb-4">This is a modal content for testing purposes.</p>
                    <div className="flex justify-end gap-2">
                      <button
                        data-testid="modal-cancel"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        data-testid="modal-confirm"
                        onClick={() => {
                          setShowModal(false);
                          toast.success('Confirmed!');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tooltip */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tooltip</h3>
              <div className="relative inline-block">
                <button
                  data-testid="tooltip-trigger"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Hover for Tooltip
                </button>
                {showTooltip && (
                  <div
                    data-testid="tooltip"
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap"
                  >
                    This is a tooltip message
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="tabs-section-title">Tabs</h2>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
                  <button
                    key={index}
                    data-testid={`tab-${index + 1}`}
                    onClick={() => setTabActive(index)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      tabActive === index
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-4" data-testid={`tab-content-${tabActive + 1}`}>
              <p>Content for Tab {tabActive + 1}</p>
              <p className="text-gray-600 mt-2">
                This is the content area for tab {tabActive + 1}. You can test tab switching functionality here.
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="accordion-section-title">Accordion</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg">
                  <button
                    data-testid={`accordion-header-${item}`}
                    onClick={() => setAccordionOpen(accordionOpen === item ? null : item)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-medium">Accordion Item {item}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        accordionOpen === item ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {accordionOpen === item && (
                    <div className="px-4 py-3 border-t" data-testid={`accordion-content-${item}`}>
                      <p>This is the content for accordion item {item}. It can contain any HTML content and is useful for testing expand/collapse functionality.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drag and Drop */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="dragdrop-section-title">Drag and Drop</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Drag Items</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]">
                  {dragItems.map((item) => (
                    <div
                      key={item}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      data-testid={`drag-item-${item.replace(' ', '-').toLowerCase()}`}
                      className="bg-blue-100 border border-blue-300 rounded p-2 mb-2 cursor-move hover:bg-blue-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Drop Zone</h3>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-testid="drop-zone"
                  className="border-2 border-dashed border-green-300 rounded-lg p-4 min-h-[200px] bg-green-50"
                >
                  {dropZone.length === 0 && (
                    <p className="text-gray-500 text-center">Drop items here</p>
                  )}
                  {dropZone.map((item, index) => (
                    <div
                      key={index}
                      data-testid={`dropped-item-${item.replace(' ', '-').toLowerCase()}`}
                      className="bg-green-100 border border-green-300 rounded p-2 mb-2"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              data-testid="reset-dragdrop"
              onClick={resetDragDrop}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reset Drag & Drop
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="table-section-title">Table</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" data-testid="data-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
                    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
                  ].map((row) => (
                    <tr key={row.id} data-testid={`table-row-${row.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          data-testid={`edit-button-${row.id}`}
                          onClick={() => toast.success(`Edit ${row.name}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          data-testid={`delete-button-${row.id}`}
                          onClick={() => toast.error(`Delete ${row.name}`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="alerts-section-title">Alerts & Notifications</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4" data-testid="info-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      This is an info alert message for testing purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4" data-testid="success-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      This is a success alert message for testing purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4" data-testid="warning-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This is a warning alert message for testing purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4" data-testid="error-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      This is an error alert message for testing purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="progress-section-title">Progress Indicators</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Progress Bar</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5" data-testid="progress-bar">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">75% Complete</p>
            </div>

            {/* Spinner */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Loading Spinner</h3>
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" data-testid="spinner"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            </div>

            {/* Skeleton Loader */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Skeleton Loader</h3>
              <div className="animate-pulse" data-testid="skeleton-loader">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Links & Navigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4" data-testid="navigation-section-title">Links & Navigation</h2>
            <div className="space-y-4">
              <div>
                <a href="#" data-testid="standard-link" className="text-blue-600 hover:text-blue-800 underline">
                  Standard Link
                </a>
              </div>
              <div>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer" data-testid="external-link" className="text-blue-600 hover:text-blue-800 underline">
                  External Link (opens in new tab) ↗
                </a>
              </div>
              <div>
                <button data-testid="button-link" className="text-blue-600 hover:text-blue-800 underline">
                  Button styled as link
                </button>
              </div>
              <nav aria-label="Breadcrumb" data-testid="breadcrumb">
                <ol className="flex items-center space-x-1 md:space-x-3">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
                  </li>
                  <li>
                    <span className="mx-2 text-gray-400">/</span>
                    <a href="#" className="text-gray-500 hover:text-gray-700">Category</a>
                  </li>
                  <li>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900">Current Page</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPlaygroundPage;