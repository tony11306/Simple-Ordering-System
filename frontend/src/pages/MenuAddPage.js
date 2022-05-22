import React, {useState, useEffect, Fragment} from 'react'
import { useNavigate } from "react-router-dom"

function IngredientItem({ingredientName, number, onNumberEdit}) {

    return (
        <div className='row'>
            <p>{ingredientName}</p>
            <p>
                {number} 單位
            </p>
            <button className='btn-1' type='button' onClick={() => onNumberEdit(ingredientName, 0)}>X</button>
        </div>
    )
}

export default function MenuAddPage() {

    const [ingredientsList, setIngredientsList] = useState([])
    const [newIngredient, setNewIngredient] = useState({})
    const [selectedIngredient, setSelectedIngredient] = useState('')
    const [selectedIngredientNumber, setSelectedIngredientNumber] = useState(0)
    const [mealName, setMealName] = useState('')
    const [mealPrice, setMealPrice] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/ingredients').then(res => res.json()).then(data => {
            setIngredientsList(data['ingredients'])
        })
    }, [])

    useEffect(() => {
        setSelectedIngredient(ingredientsList[0])
    }, [ingredientsList])

    const onSubmit = () => {
        if(mealName === '') {
            alert('請輸入餐點名稱')
            return
        }
        if(mealPrice === 0) {
            alert('請輸入餐點價格')
            return
        }
        if(Object.keys(newIngredient).length === 0) {
            alert('請輸入餐點所需食材')
            return
        }

        fetch('/menu/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealName: mealName,
                mealPrice: mealPrice,
                ingredients: newIngredient
            })
        }).then(res => res.json()).then(data => {
            alert(data['message'])
            if(data.message === '新增成功') {
                navigate('/')
            }
        })
    }


    const onAddIngredient = () => {
        // newIngredient
        // {'食材名稱': 1}

        // if selectedIngredient is in newIngredient, do nothing
        if(newIngredient[selectedIngredient]) {
            return
        }

        // if selectedIngredient is not a number, do nothing
        if(isNaN(selectedIngredientNumber)) {
            return
        }

        // if selectedIngredientNumber is 0, do nothing
        if(selectedIngredientNumber === 0) {
            return
        }

        // if selectedIngredient is not in newIngredient, add it
        setNewIngredient({...newIngredient, [selectedIngredient]: selectedIngredientNumber})

    }

    const onEditIngredient = (ingredientName, number) => {
        if(number === 0) {
            delete newIngredient[ingredientName]
        } else {
            newIngredient[ingredientName] = number
        }
        setNewIngredient({...newIngredient})
    }

    return(
        <div>
            <div className='card'>
                <label htmlFor='meal-name' className='large-text'>新增餐點名稱</label>
                <input onChange={e => setMealName(e.target.value)} id='meal-name' placeholder='Ex: 蔥爆苦瓜炒西瓜'/>

                <label htmlFor='meal-price' className='large-text'>新增餐點價格</label>
                <input onChange={e => setMealPrice(e.target.value)} id='meal-price' placeholder='Ex: 180'/>

                <p className='large-text'>餐點所需食材</p>

                <div className='min-width-80'>
                    {
                        // map newIngredient to IngredientItem
                        Object.keys(newIngredient).map(ingredientName => {
                            return (
                                <IngredientItem
                                    key={ingredientName}
                                    ingredientName={ingredientName}
                                    number={newIngredient[ingredientName]}
                                    onNumberEdit={onEditIngredient}
                                />
                            )
                        })
                    }
                </div>
                
                <div>
                    <div>
                        <label htmlFor='ingredient-name'>食材名稱</label>
                        <select id='ingredient-name' defaultValue={'選擇餐點'} onChange={e => setSelectedIngredient(e.target.value)}>
                            {ingredientsList.map(ingredient => (
                                <option key={ingredient}>{ingredient}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='ingredient-number'>食材消耗量</label>
                        <input id='ingredient-number' placeholder='Ex: 1' onChange={e => setSelectedIngredientNumber(e.target.value)}/>
                    </div>
                    <button onClick={() => onAddIngredient()} type='button' className='btn-1 float-right'>新增</button>
                </div>
                

                <button className='btn-2' onClick={() => onSubmit()}>新增餐點至系統</button>
            </div>
        </div>
    )
}