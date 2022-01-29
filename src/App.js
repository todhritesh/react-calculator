import { useReducer } from 'react';
import './style.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
    ADD_DIGIT : 'add-digit',
    CHOOSE_OPERATION : 'choose-operaion',
    CLEAR : 'clear',
    DELETE_DIGIT : 'delete-digit',
    EVALUATE : 'evaluate',
}

function reducer(state , {type , payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT :{
      if(state.overWrite){
        return {
          ...state,
          currentOperand:payload.digit,
          overWrite:false,
        }
      }
      if(payload.digit==='0' && state.currentOperand==='0'){
        return state;
      }
      if(payload.digit==='.' && state.currentOperand.includes('.')){
        return state;
      }
      return {
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`
      };
    }
    case ACTIONS.CLEAR : {
      return {};
    }
    case ACTIONS.CHOOSE_OPERATION : {
      if(state.currentOperand==null && state.previousOperand==null){
        return state;
      }
      if(state.currentOperand==null){
        return {
          ...state,
          operation:payload.operation
        }
      }
      if(state.previousOperand==null){
        return {
          ...state,
          operation:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:null,
        }
      }

      return {
        ...state,
        previousOperand:evaluate(state),
        operation:payload.operation,
        currentOperand:null
      }
    }

    case ACTIONS.EVALUATE : {
      if(state.operation ==null || state.previousOperand==null || state.currentOperand==null){
        return state;
      }
      return {
        ...state,
        overWrite:true,
        previousOperand:null,
        operation:null,
        currentOperand:evaluate(state)
      }
    }

    case ACTIONS.DELETE_DIGIT :{
      if(state.overWrite){
        return {
          ...state,
          overWrite:false,
          currentOperand:null
        }
      }
      if(state.currentOperand==null)return state
      if(state.currentOperand===1){
        return {
          ...state,
          currentOperand:null,
        }
      }

      return {
        ...state,
        currentOperand:state.currentOperand.slice(-1)
      }
    }
  }
}

function evaluate({currentOperand , previousOperand , operation}){
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch(operation){
    case "+" :
      computation = prev + curr;
    break
    case "-" :
      computation = prev - curr;
    break
    case "/" :
      computation = prev / curr;
    break
    case "x" :
      computation = prev * curr;
    break
  }
  return computation.toString();
}

const INTEGER_fORMATTER = new Intl.NumberFormat('en-in',{
  maximumFractionDigits:0
})

function formatOperand(operand){
  if(operand==null)return
  const [integer , decimal] = operand.split('.')
  if(decimal==null)return INTEGER_fORMATTER.format(integer)
}


function App() {
  const [{currentOperand , previousOperand , operation} , dispatch] = useReducer(reducer , {});
  
  return (
    <div className='calculator-grid'>
      <div className="output">
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation={'+'} dispatch={dispatch} />
      <DigitButton digit={'1'} dispatch={dispatch} />
      <DigitButton digit={'2'} dispatch={dispatch} />
      <DigitButton digit={'3'} dispatch={dispatch} />
      <OperationButton operation={'x'} dispatch={dispatch} />
      <DigitButton digit={'4'} dispatch={dispatch} />
      <DigitButton digit={'5'} dispatch={dispatch} />
      <DigitButton digit={'6'} dispatch={dispatch} />
      <OperationButton operation={'/'} dispatch={dispatch} />
      <DigitButton digit={'7'} dispatch={dispatch} />
      <DigitButton digit={'8'} dispatch={dispatch} />
      <DigitButton digit={'9'} dispatch={dispatch} />
      <OperationButton operation={'-'} dispatch={dispatch} />
      <DigitButton digit={'.'} dispatch={dispatch} />
      <DigitButton digit={'0'} dispatch={dispatch} />
      <button onClick={()=>dispatch({type:ACTIONS.EVALUATE})} className='span-two'>=</button>
    </div>
  );
}

export default App;
