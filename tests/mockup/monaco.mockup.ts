export const testInitialMockup = [
  `function x() {`,
  `\tconsole.log('Hello world!');`,
  `}`
].join("\n");

export const testInitialLanguage = "javascript";

export const NotesTree = [
  {
    id: 0,
    name: "Shortcuts",
    owner: 'Me',
    updated: new Date(2018, 12 , 1),
    sharedWith: 'Only me',
    order: 0,
    children: [
      {
        id: 1,
        name: "Multi threading C++",
        language: "cpp",
        notebookId: '0',
        type: 0,
        order: 0,
        data: `
        template <typename T>
        void printSomething() {
          std::cout << "Something" << std::endl;
          return 0;
        }`
      },
      { id: 2,
        name: "Cache friendly code",
        language: "cpp",
        notebookId: 0,
        type: 0,
        order: 0,
        data: `
        void printSomething() {
          std::cout << "Something" << std::endl;
          return 0;
        }`
      }
    ]
  },
  {
    id: 3,
    name: "Notebooks",
    owner: 'Me',
    updated: new Date(2018, 12 , 1),
    sharedWith: 'Only me',
    order: 0,
    children: [
      { 
        id: 4, 
        name: "Javascript is simple",
        language: "javascript",
        notebookId: 3,
        type: 0,
        order: 0,
        data: `function x() {
        \tconsole.log('Hello world!')
        }`,
      },
      { id: 5, 
        name: "Javascript is very simple",
        language: "javascript",
        notebookId: 3,
        type: 0,
        order: 0,
        data: `function x() {
        \tconsole.log('Hello world!')
        }`,
      }
    ]
  }
];
