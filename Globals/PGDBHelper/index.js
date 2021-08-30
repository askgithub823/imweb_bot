const fs = require('fs')

class DBHelper {
  __init__ (){
    //Check if db connection is available or not.
    if(global.db_active){
      return true
    }else {
      console.log("DB connection is not available. All DB Operations are compromised !");
      return false
    }

  }
  __promisified_file_read__ (filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data){
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
  }
  async __create_table__ (table_name, drop_flag){
    let sql_query
    if(drop_flag){
      sql_query = await this.__promisified_file_read__(`Globals/PGDBHelper/SQLQueries/delete_${table_name}.sql`)
      sql_query = sql_query.toString()
      let [data] = await pg_con.query(sql_query)
    }
    sql_query = await this.__promisified_file_read__(`Globals/PGDBHelper/SQLQueries/create_${table_name}.sql`)
    sql_query = sql_query.toString()
    let [data] = await pg_con.query(sql_query)
  }

  constructor (){
    if(! this.__init__ () ) return

  }

  async delete_chat_history(user_id){
    let sql_query=`DELETE FROM postgres."ACC_CHAT_HISTORY" WHERE "USER_ID"='${user_id}'`
    let data=await pg_con.query(sql_query)
    console.log(data)
  }

  async fetch_all_tables () {
    if(! this.__init__ () ) return
    let sql_query = await this.__promisified_file_read__("Globals/PGDBHelper/SQLQueries/fetch_all_tables.sql")
    sql_query = sql_query.toString()
    let [data] = await pg_con.query(sql_query)
    let x = []
    for(let temp of data){
      x.push(temp.table_name)
    }
    console.log(`All tables : ${x.join(",")}`);
    return x
  }

  /**
   * This function will create specific table. it will skip or forcedly create table.
   * @param  {[array of string]} tables_list [list of tables]
   * @param  {[string]} table_name  [name of the table to create]
   * @param  {[dictionary]} args        [override{true:existing table will be dropped and created.false: it will skip}]
   * @return {[]} None        []
   */
  check_and_create (tables_list, table_name, args={}){
    if(! this.__init__ () ) return

    if(tables_list.includes(table_name)){
      console.log(`Table ${table_name} exists in collection !`);
      if(args.override){
        console.log("Since, override flag is set, we will recreate the table.");
        this.__create_table__(table_name,true)
      }
    }
    else {
      console.log(`Table ${table_name} will be created in background.`);
      this.__create_table__(table_name,false)
    }

  }

  /**
   * [Fetches the chat history between requested date gaps]
   * @param  {[type]}  user_id     [key cloak user ID]
   * @param  {[type]}  query_param [lt=>1$$gt=>1 is the sample params]
   * @return {Promise}             [a query and we need to use await on function call]
   */
  async fetch_chat_history (user_id,query_param) {
    let params = query_param.split("$$")


    let sql_query = await this.__promisified_file_read__("Globals/PGDBHelper/SQLQueries/fetch_rows_ACC_CHAT_HISTORY.sql")
    sql_query = sql_query.toString()
    sql_query = sql_query.split("$$user_id$$").join(user_id)
    for(let param of params){
      let temp = param.split("=>")
      console.log(`$$${temp[0]}$$`);
      sql_query = sql_query.split(`$$${temp[0]}$$`).join(temp[1])
    }

    let data = await pg_con.query(sql_query)
    return data[0]
  }

  async check_chat_history (user_id) {
    let sql_query = await this.__promisified_file_read__("Globals/PGDBHelper/SQLQueries/check_rows_ACC_CHAT_HISTORY.sql")
    sql_query = sql_query.toString()
    sql_query = sql_query.split("$$user_id$$").join(user_id)
    let [data] = await pg_con.query(sql_query)
    return data
  }

  async chat_history__update_record (user_id,chat_history){
    //$$user_id$$
    let gt = 0
    let lt = 1
    let sql_query = await this.__promisified_file_read__("Globals/PGDBHelper/SQLQueries/fetch_rows_ACC_CHAT_HISTORY.sql")
    sql_query = sql_query.toString()
    sql_query = sql_query.split("$$user_id$$").join(user_id)
    sql_query = sql_query.split("$$gt$$").join(gt)
    sql_query = sql_query.split("$$lt$$").join(lt)

    let [data] = await pg_con.query(sql_query)
    if(data.length>0){
      // Code to append chat history

      chat_history = JSON.parse(chat_history)
      let row_id = data[0].ID
      let historical = data[0].CHAT
      chat_history = [...historical,...chat_history]
      chat_history = JSON.stringify(chat_history)
      let update_query = `
      UPDATE postgres."ACC_CHAT_HISTORY"
      set "CHAT"=$$${chat_history}$$
      where "ID" = ${row_id}
      `
      let db_q_op = await pg_con.query(update_query)
    }
    else {
      let insert_query = `
      INSERT INTO postgres."ACC_CHAT_HISTORY"(
      	"USER_ID", "CHAT")
      	VALUES ('${user_id}',$$${chat_history}$$);
      `
      let db_q_op = await pg_con.query(insert_query)
    }
  }
}

module.exports = DBHelper
