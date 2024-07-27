defmodule CobaltWeb.ChatLive do
  use CobaltWeb, :live_view
  require Logger

  def mount(_param, _session, socket) do
    socket = 
      socket 
      |> assign(:slug, "no-slug")
      
    {:ok, socket}
  end
  
  def handle_event("new-slug", _params, socket) do
    slug = MnemonicSlugs.generate_slug()
    Logger.info(slug) 
    {:noreply, assign(socket, :slug, slug)}
    # {:noreply, push_navigate(socket, to: ~p"/registration/")}
  end

  def handle_event(event, _params, socket) do
    IO.inspect(event, label: "#{__MODULE__} event")
    {:noreply, socket}
  end
end
