/*
db.getCollection('my_booking').find({"hospitalName":/xx医院/,openId:/^2/}).forEach(
  function(item){
    db.getCollection('my_booking').update({"_id":item._id},{$set:{"payType": "1"}})
  }
)*/
