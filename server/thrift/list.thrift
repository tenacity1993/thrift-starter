struct Item {
1: string name,
2: i16 age
}

struct Data {
1: string code,
2: string msg,
3: list<Item> dataList
}

service GetList {
void ping()
Data get()
Data post(1: string name, 2: i16 age)
}
