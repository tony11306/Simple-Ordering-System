from flask import Flask
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)

from api.ingredients import Ingredients, IngredientStock, AddIngredient, EditIngredientStock, DeleteIngredient
from api.menu import Menu, AddMenu, DeleteMenu
from api.order import Order
from api.history import History

# 這邊設定主要是讓傳遞的資料可以是中文
app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_MINETYPE'] = 'application/json;charset=utf-8'
app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))

# 這邊開始設定 api 的路由
api.add_resource(Ingredients, '/ingredients')
api.add_resource(AddIngredient, '/ingredients/add')
api.add_resource(DeleteIngredient, '/ingredients/delete')
api.add_resource(Menu, '/menu')
api.add_resource(Order, '/order')
api.add_resource(History, '/history')
api.add_resource(AddMenu, '/menu/add')
api.add_resource(DeleteMenu, '/menu/delete')
api.add_resource(IngredientStock, '/ingredients/stock')
api.add_resource(EditIngredientStock, '/ingredients/stock/edit')

if __name__ == '__main__':
    app.run(debug=True)