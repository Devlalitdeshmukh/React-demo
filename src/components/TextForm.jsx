import React, { useState } from "react";

function TextForm(props){
    const handleUpClick = ()=> {
        let newText = text.toUpperCase();
        setText(newText);
    }

    const handleOnChange = (event)=> {
        setText(event.target.value);
    }

    const handleUpClickLower = () => {
        let newText = text.toLocaleLowerCase();
        setText(newText);
    }
    
    const handleClearClick = () => {
        setText('');
    }
    
    const handleCopyClick = () => {
        navigator.clipboard.writeText(text);
        alert('Text copied to clipboard!');
    }
    
    const handleRemoveExtraSpaces = () => {
        let newText = text.split(/[ ]+/);
        setText(newText.join(" "));
    }

    const [text, setText] = useState("");
    
    return (
        <div className="container-fluid my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0 text-start">
                        <i className="bi bi-fonts me-2"></i>{props.title || "Text Formatter"}
                    </h4>
                </div>
                <div className="card-body">
                    <div className="mb-3 text-start">
                        <label htmlFor="textForm" className="form-label text-start">Enter your text below:</label>
                        <textarea 
                            className="form-control" 
                            value={text} 
                            onChange={handleOnChange} 
                            placeholder="Enter your text here..." 
                            id="textForm" 
                            rows="8"
                        ></textarea>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <button type="button" className="btn btn-primary" onClick={handleUpClick}>
                            <i className="bi bi-text-uppercase me-2"></i>Convert to Uppercase
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleUpClickLower}>
                            <i className="bi bi-text-lowercase me-2"></i>Convert to Lowercase
                        </button>
                        <button type="button" className="btn btn-success" onClick={handleRemoveExtraSpaces}>
                            <i className="bi bi-eraser me-2"></i>Remove Extra Spaces
                        </button>
                        <button type="button" className="btn btn-info" onClick={handleCopyClick}>
                            <i className="bi bi-clipboard me-2"></i>Copy Text
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleClearClick}>
                            <i className="bi bi-trash me-2"></i>Clear Text
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0 text-start">
                        <i className="bi bi-info-circle me-2"></i>Text Summary
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="border rounded p-3 text-center">
                                <div className="display-6 text-primary">{text.split(/\s+/).filter((element)=>{return element.length!==0}).length}</div>
                                <div className="text-muted">Words</div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="border rounded p-3 text-center">
                                <div className="display-6 text-success">{text.length}</div>
                                <div className="text-muted">Characters</div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="border rounded p-3 text-center">
                                <div className="display-6 text-warning">{text.length > 0 ? (0.008 * text.split(" ").length).toFixed(2) : 0}</div>
                                <div className="text-muted">Minutes Read</div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="border rounded p-3 text-center">
                                <div className="display-6 text-info">{text.split(".").length - 1}</div>
                                <div className="text-muted">Sentences</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0 text-start">
                        <i className="bi bi-eye me-2"></i>Preview
                    </h5>
                </div>
                <div className="card-body">
                    {text.length > 0 ? (
                        <p className="mb-0 text-start">{text}</p>
                    ) : (
                        <p className="text-muted mb-0 text-start">Enter some text above to see the preview here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TextForm;