class MarkerChannel < ApplicationCable::Channel
  before_subscribe :send_markers_list

  def subscribed
    stream_from "marker_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def send_markers_list
    markers = Marker.all # Replace with your own marker retrieval logic
    data = { type: "markers_list", markers: markers }
    transmit(data)
  end

end
