import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/common/Header';
import { useAuthStore } from '../store/authStore';

const ComponentPlaygroundPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(true);
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
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [dropZone, setDropZone] = useState<string[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [tabActive, setTabActive] = useState(0);
  const [counter, setCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize drag items with translations
  useEffect(() => {
    setDragItems([
      t('componentPlayground.labels.item1'),
      t('componentPlayground.labels.item2'),
      t('componentPlayground.labels.item3'),
      t('componentPlayground.labels.item4')
    ]);
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('componentPlayground.messages.formSubmitted'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success(t('componentPlayground.messages.fileSelected', { fileName: e.target.files[0].name }));
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
      toast.success(t('componentPlayground.messages.itemDropped', { item: draggedItem }));
    }
  };

  const resetDragDrop = () => {
    setDragItems([
      t('componentPlayground.labels.item1'),
      t('componentPlayground.labels.item2'),
      t('componentPlayground.labels.item3'),
      t('componentPlayground.labels.item4')
    ]);
    setDropZone([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Common Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Guide */}
        {showGuide && (
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">🎯 {t('componentPlayground.guide.title')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t('componentPlayground.guide.scenarios')}</h3>
                <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li>✅ <strong>{t('componentPlayground.guide.formValidation').split(':')[0]}</strong>: {t('componentPlayground.guide.formValidation').split(':')[1]}</li>
                  <li>✅ <strong>{t('componentPlayground.guide.interactionTest').split(':')[0]}</strong>: {t('componentPlayground.guide.interactionTest').split(':')[1]}</li>
                  <li>✅ <strong>{t('componentPlayground.guide.dragDrop').split(':')[0]}</strong>: {t('componentPlayground.guide.dragDrop').split(':')[1]}</li>
                  <li>✅ <strong>{t('componentPlayground.guide.tabNavigation').split(':')[0]}</strong>: {t('componentPlayground.guide.tabNavigation').split(':')[1]}</li>
                  <li>✅ <strong>{t('componentPlayground.guide.dataTable').split(':')[0]}</strong>: {t('componentPlayground.guide.dataTable').split(':')[1]}</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t('componentPlayground.guide.exercises')}</h3>
                <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  {(t('componentPlayground.guide.exerciseItems', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>🔍 {item}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>💡 {t('componentPlayground.guide.tip').split(':')[0]}:</strong> {t('componentPlayground.guide.tip').substring(t('componentPlayground.guide.tip').indexOf(':') + 1)}
              </p>
            </div>
          </div>
        )}
        
        {!showGuide && (
          <button
            onClick={() => setShowGuide(true)}
            className="mb-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            📖 {t('testingGuide.showGuide')}
          </button>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa')}
          className="mb-6 inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          data-testid="back-to-qa-hub"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('common.back')}
        </button>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8" data-testid="playground-title">
          {t('componentPlayground.title')}
        </h1>
        
        <div className="space-y-8">
          {/* Form Elements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="form-section-title">{t('componentPlayground.sections.forms')}</h2>
            <form onSubmit={handleSubmit} data-testid="test-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Text Input */}
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.textInput')}
                  </label>
                  <input
                    type="text"
                    id="text-input"
                    data-testid="text-input"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterText')}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.emailInput')}
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    data-testid="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterEmail')}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.passwordInput')}
                  </label>
                  <input
                    type="password"
                    id="password-input"
                    data-testid="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterPassword')}
                  />
                </div>

                {/* Number Input */}
                <div>
                  <label htmlFor="number-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.numberInput')}
                  </label>
                  <input
                    type="number"
                    id="number-input"
                    data-testid="number-input"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Tel Input */}
                <div>
                  <label htmlFor="tel-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.telephoneInput')}
                  </label>
                  <input
                    type="tel"
                    id="tel-input"
                    data-testid="tel-input"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterTelephone')}
                  />
                </div>

                {/* URL Input */}
                <div>
                  <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.urlInput')}
                  </label>
                  <input
                    type="url"
                    id="url-input"
                    data-testid="url-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterUrl')}
                  />
                </div>

                {/* Search Input */}
                <div>
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.searchInput')}
                  </label>
                  <input
                    type="search"
                    id="search-input"
                    data-testid="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterSearch')}
                  />
                </div>

                {/* Date Input */}
                <div>
                  <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.dateInput')}
                  </label>
                  <input
                    type="date"
                    id="date-input"
                    data-testid="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.timeInput')}
                  </label>
                  <input
                    type="time"
                    id="time-input"
                    data-testid="time-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Color Input */}
                <div>
                  <label htmlFor="color-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.colorInput')}
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
                  <label htmlFor="select-dropdown" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.selectDropdown')}
                  </label>
                  <select
                    id="select-dropdown"
                    data-testid="select-dropdown"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">{t('componentPlayground.labels.chooseOption')}</option>
                    <option value="option1">{t('componentPlayground.labels.option1')}</option>
                    <option value="option2">{t('componentPlayground.labels.option2')}</option>
                    <option value="option3">{t('componentPlayground.labels.option3')}</option>
                  </select>
                </div>

                {/* File Input */}
                <div>
                  <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.fileInput')}
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
                      {t('componentPlayground.labels.selectedFile', { fileName: file.name })}
                    </p>
                  )}
                </div>

                {/* Range Slider */}
                <div className="col-span-2">
                  <label htmlFor="range-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.rangeSlider', { value: range })}
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
                  <label htmlFor="textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('componentPlayground.labels.textarea')}
                  </label>
                  <textarea
                    id="textarea"
                    data-testid="textarea"
                    rows={4}
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t('componentPlayground.labels.enterMultilineText')}
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
                  <label htmlFor="checkbox" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    {t('componentPlayground.labels.checkboxOption')}
                  </label>
                </div>

                {/* Radio Buttons */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('componentPlayground.labels.radioButtons')}</p>
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
                        <label htmlFor={`radio-${option}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                          {t('componentPlayground.labels.radioOption', { number: option.charAt(option.length - 1) })}
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
                  {t('componentPlayground.labels.submitForm')}
                </button>
              </div>
            </form>
          </div>

          {/* Buttons Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="buttons-section-title">{t('componentPlayground.sections.buttons')}</h2>
            <div className="flex flex-wrap gap-4">
              <button
                data-testid="primary-button"
                onClick={() => toast.success(t('componentPlayground.messages.primaryButtonClicked'))}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('componentPlayground.labels.primaryButton')}
              </button>
              <button
                data-testid="secondary-button"
                onClick={() => toast.success(t('componentPlayground.messages.secondaryButtonClicked'))}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {t('componentPlayground.labels.secondaryButton')}
              </button>
              <button
                data-testid="success-button"
                onClick={() => toast.success(t('componentPlayground.messages.success'))}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t('componentPlayground.labels.successButton')}
              </button>
              <button
                data-testid="warning-button"
                onClick={() => toast(t('componentPlayground.messages.warning'), { icon: '⚠️' })}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                {t('componentPlayground.labels.warningButton')}
              </button>
              <button
                data-testid="danger-button"
                onClick={() => toast.error(t('componentPlayground.messages.danger'))}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t('componentPlayground.labels.dangerButton')}
              </button>
              <button
                data-testid="disabled-button"
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                {t('componentPlayground.labels.disabledButton')}
              </button>
              <button
                data-testid="loading-button"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
              >
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('componentPlayground.labels.loading')}
              </button>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="interactive-section-title">{t('componentPlayground.sections.interactive')}</h2>
            
            {/* Counter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.counter')}</h3>
              <div className="flex items-center gap-4">
                <button
                  data-testid="decrement-button"
                  onClick={() => setCounter(counter - 1)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <span data-testid="counter-value" className="text-xl font-bold text-gray-900 dark:text-gray-100">
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
                  {t('componentPlayground.labels.reset')}
                </button>
              </div>
            </div>

            {/* Modal */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.modal')}</h3>
              <button
                data-testid="open-modal"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {t('componentPlayground.labels.openModal')}
              </button>
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="modal">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('componentPlayground.labels.modalTitle')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{t('componentPlayground.labels.modalContent')}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        data-testid="modal-cancel"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                      >
                        {t('componentPlayground.labels.cancel')}
                      </button>
                      <button
                        data-testid="modal-confirm"
                        onClick={() => {
                          setShowModal(false);
                          toast.success(t('componentPlayground.messages.confirmed'));
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {t('componentPlayground.labels.confirm')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tooltip */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.tooltip')}</h3>
              <div className="relative inline-block">
                <button
                  data-testid="tooltip-trigger"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {t('componentPlayground.labels.hoverTooltip')}
                </button>
                {showTooltip && (
                  <div
                    data-testid="tooltip"
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded whitespace-nowrap"
                  >
                    {t('componentPlayground.labels.tooltipMessage')}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="tabs-section-title">{t('componentPlayground.sections.tabs')}</h2>
            <div className="border-b border-gray-200 dark:border-gray-600">
              <nav className="-mb-px flex space-x-8">
                {[t('componentPlayground.labels.tab1'), t('componentPlayground.labels.tab2'), t('componentPlayground.labels.tab3')].map((tab, index) => (
                  <button
                    key={index}
                    data-testid={`tab-${index + 1}`}
                    onClick={() => setTabActive(index)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      tabActive === index
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-4" data-testid={`tab-content-${tabActive + 1}`}>
              <p className="text-gray-900 dark:text-gray-100">{t('componentPlayground.labels.tabContent', { number: tabActive + 1 })}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('componentPlayground.labels.tabContentDescription', { number: tabActive + 1 })}
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="accordion-section-title">{t('componentPlayground.sections.accordion')}</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  <button
                    data-testid={`accordion-header-${item}`}
                    onClick={() => setAccordionOpen(accordionOpen === item ? null : item)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{t('componentPlayground.labels.accordionItem', { number: item })}</span>
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
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600" data-testid={`accordion-content-${item}`}>
                      <p className="text-gray-700 dark:text-gray-300">{t('componentPlayground.labels.accordionContent', { number: item })}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drag and Drop */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="dragdrop-section-title">{t('componentPlayground.sections.dragDrop')}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.dragItems')}</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[200px]">
                  {dragItems.map((item) => (
                    <div
                      key={item}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      data-testid={`drag-item-${item.replace(' ', '-').toLowerCase()}`}
                      className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 rounded p-2 mb-2 cursor-move hover:bg-blue-200 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.dropZone')}</h3>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-testid="drop-zone"
                  className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-4 min-h-[200px] bg-green-50 dark:bg-green-900/20"
                >
                  {dropZone.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center">{t('componentPlayground.labels.dropItemsHere')}</p>
                  )}
                  {dropZone.map((item, index) => (
                    <div
                      key={index}
                      data-testid={`dropped-item-${item.replace(' ', '-').toLowerCase()}`}
                      className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded p-2 mb-2 text-gray-900 dark:text-gray-100"
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
              {t('componentPlayground.labels.resetDragDrop')}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="table-section-title">{t('componentPlayground.sections.table')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600" data-testid="data-table">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('componentPlayground.labels.tableId')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('componentPlayground.labels.tableName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('componentPlayground.labels.tableEmail')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('componentPlayground.labels.tableStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('componentPlayground.labels.tableActions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {[
                    { id: 1, name: t('componentPlayground.labels.johnDoe'), email: 'john@example.com', status: t('componentPlayground.labels.active') },
                    { id: 2, name: t('componentPlayground.labels.janeSmith'), email: 'jane@example.com', status: t('componentPlayground.labels.inactive') },
                    { id: 3, name: t('componentPlayground.labels.bobJohnson'), email: 'bob@example.com', status: t('componentPlayground.labels.active') },
                  ].map((row) => (
                    <tr key={row.id} data-testid={`table-row-${row.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.status === t('componentPlayground.labels.active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          data-testid={`edit-button-${row.id}`}
                          onClick={() => toast.success(t('componentPlayground.messages.editUser', { name: row.name }))}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                        >
                          {t('componentPlayground.labels.edit')}
                        </button>
                        <button
                          data-testid={`delete-button-${row.id}`}
                          onClick={() => toast.error(t('componentPlayground.messages.deleteUser', { name: row.name }))}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          {t('componentPlayground.labels.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="alerts-section-title">{t('componentPlayground.sections.alerts')}</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4" data-testid="info-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('componentPlayground.labels.infoAlertMessage')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4" data-testid="success-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {t('componentPlayground.labels.successAlertMessage')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4" data-testid="warning-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {t('componentPlayground.labels.warningAlertMessage')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4" data-testid="error-alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t('componentPlayground.labels.errorAlertMessage')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="progress-section-title">{t('componentPlayground.sections.progress')}</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.progressBar')}</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5" data-testid="progress-bar">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t('componentPlayground.labels.progressComplete', { percent: 75 })}</p>
            </div>

            {/* Spinner */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.loadingSpinner')}</h3>
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" data-testid="spinner"></div>
                <span className="text-gray-600 dark:text-gray-400">{t('componentPlayground.labels.loading')}</span>
              </div>
            </div>

            {/* Skeleton Loader */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('componentPlayground.labels.skeletonLoader')}</h3>
              <div className="animate-pulse" data-testid="skeleton-loader">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Links & Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" data-testid="navigation-section-title">{t('componentPlayground.sections.navigation')}</h2>
            <div className="space-y-4">
              <div>
                <a href="#" data-testid="standard-link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
                  {t('componentPlayground.labels.standardLink')}
                </a>
              </div>
              <div>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer" data-testid="external-link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
                  {t('componentPlayground.labels.externalLink')}
                </a>
              </div>
              <div>
                <button data-testid="button-link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
                  {t('componentPlayground.labels.buttonLink')}
                </button>
              </div>
              <nav aria-label="Breadcrumb" data-testid="breadcrumb">
                <ol className="flex items-center space-x-1 md:space-x-3">
                  <li>
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{t('componentPlayground.labels.home')}</a>
                  </li>
                  <li>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{t('componentPlayground.labels.category')}</a>
                  </li>
                  <li>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-gray-900 dark:text-gray-100">{t('componentPlayground.labels.currentPage')}</span>
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