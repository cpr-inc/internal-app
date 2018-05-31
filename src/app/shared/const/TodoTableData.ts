export const TodoTableColItems　= [
    'No.','タイトル','重要度','期限','開始日',
    '作業状況','編集・削除'
]

export interface TASK {
    key?: string;
    No: number;
    title: string;
    description?: string;
    priority?: string;
    deadline?: string;
    startdate?: string;
    state?: string;
    creatdate: string;
    isEdit?: boolean;
    isTrash?: boolean;
}

export const TodoTableDateList:TASK[] = [
    {
        No: 1,
        title: 'テストタスク０１',
        description: 'test',
        priority: '高',
        deadline: '17/03/21 13:18',
        startdate: '17/03/21 13:18',
        state: '作業中',
        creatdate: '17/03/21 13:18 34s',
        isEdit: false,
        isTrash: false,
    },
    {
        No: 2,
        title: 'テストタスク０２',
        description: 'test',
        priority: '中',
        deadline: '17/03/21 13:18',
        startdate: '17/03/21 13:18',
        state: '開始前',
        creatdate: '17/03/21 13:18 34s',
        isEdit: false,
        isTrash: false,
    },
    {
        No: 3,
        title: 'テストタスク０２',
        description: 'test',
        priority: '低',
        deadline: '17/03/21 13:18',
        startdate: '17/03/21 13:18',
        state: '開始前',
        creatdate: '17/03/21 13:18 34s',
        isEdit: false,
        isTrash: false,
    }
]