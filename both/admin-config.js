AdminConfig = {
  collections: {
    Pannelli: {
      color: 'green',
      icon: 'desktop',
      omitFields: ['name_sort'],
      tableColumns: [
        { label: "Impianto", name: "nome" },
        { label: "IP", name: "host" },
        { label: "Porta", name: "port" },
        { label: "Abilitato", name: "enabled", template: "boolean" }
      ]
    }
  }
};
