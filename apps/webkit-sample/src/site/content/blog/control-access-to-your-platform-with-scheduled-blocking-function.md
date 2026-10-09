Have you ever wanted to control access to your application so that users can only access it during a certain period of the day? Let’s say we are in charge of delivering the live streaming of a video game championship that will be, every day of the week, between 6 and 9 pm (PST).

Obviously, we could create a static response on our server during periods when the transmission is offline. However, in that case we would be receiving many requests, consuming our server resources with unwanted requests.

Well, Azion has a new feature that can help you solve this problem: the edge function Scheduled Blocking.

Scheduled Blocking is an edge function that allows you to control access to your applications based on time windows, directly from our edge locations, so that users will only have access to your infrastructure when it’s really necessary.

In this blog, you will learn how to use this new feature.

## First, Let’s Get The Function in The Azion Marketplace

As this is a free feature, all you need to do is to find and download it in our [Marketplace](https://console.azion.com/marketplace).

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_1.png" alt="Image with card from Azion's Marketplace Scheduled Blocking solution" />

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_2.png" alt="Image with card from Azion's Marketplace Scheduled Blocking solution" />

## Then, Let’s Use It

Once we’ve acquired the edge function, we can use it on any of our Edge Firewalls (any one that has the Edge Functions module enabled). So, our next step is to access the Edge Firewall functions section responsible for protecting our Edge Application (or create a new Edge Firewall, if our application doesn’t have an Edge Firewall linked) and create a new Function Instance of the Scheduled Blocking function.

The basic JSON Args of our new function instance would look like this:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_3.png" alt="Image showing how to control application access based on time windows" />

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_4.png" alt="imagem showing how to control application access based on time windows" />

In a brief summary about our JSON Args, we have two schedules since our rule is slightly different during weekdays and weekends.

In the first schedule, which is active from Monday to Friday, as can be seen in the “week_days” field above, we will execute the “action” deny (that is, we will block the request) when the function is executed out of range (so the “execute_action_when” is set to “not_in_interval”) from 21:00 to 23:59––remember that the function is always based on UTC time, in the 24-hour format.

The second schedule is used on weekends. As we don’t want to receive any type of access on these two days, we use an interval that goes from 00:00 to 23:59––that is, the entire day.

Once our Function Instance is created, the next step is to add it to a Rule Engine rule. In this example, we want to execute the function for all routes in our application, so the rule would look like this:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_5.png" alt="imagem showing how to control application access based on time windows" />

Once the changes are propagated, whenever we try to access our application on the weekend or before 21:00 UTC on weekdays, we will receive a 403 status code response from Azion edge locations.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_6.png" alt="Image showing error 403 forbidden" />

## Let’s Customize Our Response a Little Bit

Although our function is already preventing unauthorized access to our application, we can customize it to return a more meaningful message to users. For that, let’s go back to the JSON Args of our Function Instance and make some changes. By changing the “action” of our Function Instance from “deny” to “static_response”, we can also define a status code and a message to be used in the blocking response sent by the edge function.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_6-1.png" alt="Image showing how to control application access based on time windows" />

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_7.png" alt="Image showing how to control application access based on time windows" />

After making this change, the return made by the edge function will be the following:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_8.png" alt="image with a message from the scheduled blocking function: streaming is offline, come back later" />

## Even More Customizations

Right, our edge function is already delivering a more user-friendly response, but there’s still one more level of customization. Instead of using the “static_response_data.message” key, we can replace it with “static_response_data.html”, which allows us to add a custom HTML to be delivered by the function during blocking periods.

So, if we change the JSON Args to something like:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_9.png" alt="imagem showing how to control application access based on time windows" />

Our answer would then be:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_10.png" alt="image with a message from the scheduled blocking function: The service is offline! See you at 6pm!" />

As the Edge Function allows us to insert an entire HTML page, we can also add CSS styles to make our response even more pleasing to the user. So when we use the following content in JSON Args:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_11.png" alt="Image showing how to control application access based on time windows" />

We would have the following result:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_12.png" alt="image with a message from the scheduled blocking function: our stream starts at 6pm" />

Cool, isn’t it?

## Adding Other Features

We now have a schedule that allows us to block user access during periods when our live stream is offline. But let’s pretend that our contract with a video game championship only allows us to broadcast the competition in Brazil, the United States, and Mexico? No problem, just add a new rule to our Edge Firewall!

At this point, our Edge Firewall rules should look like this:

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_13.png" alt="Imagem mostrando como controlar o acesso a aplicações com base em janelas de tempo" />

So, first, we must enable the Network Layer Protection module in the Main Settings of our Edge Firewall (if you haven’t already done so). After that, we’ll create a new Network List of the “Country” type, including the countries Brazil, United States, and Mexico.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_14.png" alt="Image showing how to control application access based on time windows" />

Back to our Edge Firewall, we can create a new rule, where we will “drop” the connection of any request made from outside the countries we want.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_15.png" alt="imagem showing how to control application access based on time windows" />

After that, let’s reorder our rules so that the geolocation check is done before our block scheduling edge function, so the function will only be used when needed.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_16.png" alt="Image showing how to control application access based on time windows" />

As a result, if we try to make a request from Chile, for example, we’ll receive an empty response from Azion’s edge locations.

<Frame src="https://www.azion.com/assets/content/blog/uploads/access-_to_your_platform_with_scheduled_blocking_function_17.png" alt="image with a message from the scheduled blocking function: the connection was reset" />

*Voilà*! Our application is protected against accesses during unwanted hours and also against accesses from unwanted locations!

### Don’t Have Access to Our Schedule Blocking Function Yet?

[ACCESS HERE](https://console.azion.com/marketplace)

### Or sign up for an account

[SIGN UP NOW](https://console.azion.com/signup/)

#### Azion

#### Built for enterprises, loved by developers.
