defmodule CobaltWeb.ChatLive do
  use CobaltWeb, :live_view
  require Logger

  @file __ENV__.file
  def mount(_param, _session, socket) do
    socket =
      socket
      |> assign(:slug, "no-slug")
      |> assign_styles()

    {:ok, socket}
  end

  def assign_styles(socket) do
    case Utils.get_styles(__DIR__) do
      {:ok, styles} ->
        assign(socket, :styles, styles)

      {:error, err, dir} ->
        IO.inspect(err, label: "#{@file}: couldn't get the styles file in #{dir}")
        socket
    end
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
