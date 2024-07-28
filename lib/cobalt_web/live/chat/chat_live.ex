defmodule CobaltWeb.ChatLive do
  use CobaltWeb, :live_view
  require Logger

  def mount(_param, _session, socket) do
    # TODO: find a way to reolve "chat.styles.json" in get_styles 
    json = "/Users/admin/Desktop/code/cobalt/lib/cobalt_web/live/chat/chat.styles.json"
    {:ok, styles} = Utils.get_styles(json)

    socket =
      socket
      |> assign(:slug, "no-slug")
      |> assign(:styles, styles)

    {:ok, socket}
  end

  def handle_event("new-slug", _params, socket) do
    slug = MnemonicSlugs.generate_slug()
    {:noreply, assign(socket, :slug, slug)}
    # {:noreply, push_navigate(socket, to: ~p"/registration/")}
  end

  def handle_event(event, _params, socket) do
    IO.inspect(event, label: "#{__MODULE__} event")
    {:noreply, socket}
  end
end
