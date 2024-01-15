import ContentFeedback from "../templates/content-feedback-block/index.vue"

export default {
  title: 'Blocks/Content Feedback Block',
  component: ContentFeedback,
  tags: ['autodocs'],
  argsType: {
    cards: {
      table: {
        isCompany: Boolean,
        name: String,
        role: String,
        image: URL,
        text: String
      },
      type: Array
    },
    autoplayInterval: Number,
  }
}

const cardlist = [
  {
    isCompany: true,
    name: "Google Inc",
    image: "https://www.azion.com/static/images/v3/home/logo-arezzo.png",
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!'
  },
  {
    isCompany: false,
    name: "Paulo Moura",
    role: "Tech Writer",
    image: "https://www.azion.com/static/images/uploads/paulo-moura.png",
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!'
  },
  {
    isCompany: false,
    name: "Luis Igreja",
    role: "Software Engineer",
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!'
  },
  {
    isCompany: false,
    name: "Luis Igreja",
    role: "Software Engineer",
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!'
  },
  {
    isCompany: false,
    name: "Luis Igreja",
    role: "Software Engineer",
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!'
  }
]

export const Default = {
  args: {
    cards: cardlist,
    autoplayInterval: 2000,
  }
};
