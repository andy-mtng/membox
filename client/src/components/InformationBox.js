function InformationBox({ message, type }) {
    const getClassName = () => {
        switch (type) {
          case 'success':
            return 'success-box';
          case 'error':
            return 'error-box';
          case 'warning':
            return 'warning-box';
          case 'info':
            return 'info-box';
          default:
            return '';
        }
      };
    
    const boxClassName = getClassName();

    return (
        <div>
            <h2>{boxClassName}</h2>
            <h1>{message}</h1>
        </div>
    )
}

export default InformationBox;